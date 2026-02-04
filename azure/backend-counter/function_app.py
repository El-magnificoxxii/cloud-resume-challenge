import os
import json
import logging
import azure.functions as func
from azure.cosmos import CosmosClient, exceptions

app = func.FunctionApp(http_auth_level=func.AuthLevel.ANONYMOUS)

# -----------------------
# Cosmos helpers
# -----------------------

def get_container():
    client = CosmosClient(
        url=os.environ["COSMOS_ENDPOINT"],
        credential=os.environ["COSMOS_KEY"]
    )

    db = client.get_database_client(os.environ["COSMOS_DATABASE"])
    container = db.get_container_client(os.environ["COSMOS_CONTAINER"])
    return container


def make_response(status, body):
    return func.HttpResponse(
        json.dumps(body),
        status_code=status,
        mimetype="application/json"
    )

# -----------------------
# Core logic
# -----------------------

def get_count():
    container = get_container()
    doc_id = os.environ.get("COUNTER_ID", "global")

    try:
        doc = container.read_item(item=doc_id, partition_key=doc_id)
        count = int(doc.get("count", 0))
    except exceptions.CosmosResourceNotFoundError:
        count = 0

    return make_response(200, {"count": count})


def increment():
    container = get_container()
    doc_id = os.environ.get("COUNTER_ID", "global")

    try:
        # Atomic increment (PATCH)
        ops = [
            {"op": "incr", "path": "/count", "value": 1}
        ]
        doc = container.patch_item(
            item=doc_id,
            partition_key=doc_id,
            patch_operations=ops
        )
        new_count = int(doc["count"])

    except exceptions.CosmosResourceNotFoundError:
        # Create doc if it doesn't exist
        doc = {
            "id": doc_id,
            "count": 1
        }
        container.create_item(body=doc)
        new_count = 1

    return make_response(200, {"count": new_count})


# -----------------------
# HTTP Trigger
# -----------------------

@app.route(route="http_trigger", auth_level=func.AuthLevel.ANONYMOUS)
def http_trigger(req: func.HttpRequest) -> func.HttpResponse:
    logging.info("Cosmos DB counter function triggered.")

    method = req.method.upper()

    if method == "GET":
        return get_count()

    if method == "POST":
        return increment()

    return make_response(405, {"error": "Method Not Allowed"})
