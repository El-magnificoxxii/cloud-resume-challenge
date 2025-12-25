import React from "react";
import "css/pages/resume.css";

import ResumeHeader from "comps/resume/ResumeHeader";
import ResumeSection from "comps/resume/ResumeSection";
import ResumeSectionItem from "comps/resume/ResumeSectionItem";

import resumeData from "data/resumeData";

export default function ResumePage() {
  return (
    <>
      <ResumeHeader person={resumeData.person} />

      {resumeData.sections.map(section => (
        <ResumeSection
          key={section.id}
          title={section.title}
          className={section.className}
        >
          <div className="items">
            {section.items.map((item, index) => (
              <ResumeSectionItem key={index} item={item} />
            ))}
          </div>
        </ResumeSection>
      ))}
    </>
  );
}
