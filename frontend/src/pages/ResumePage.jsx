import React from "react";
import 'css/pages/resume.css'
export default function ResumePage() {
  return (
    <>
      <section className="header">
        <h1>Abdullateef Oni</h1>
        <p>
            &bull;
            <a href="mailto:abdullateefoni@yahoo.com">abdullateefoni@yahoo.com</a>
            &bull; |
            &bull;
            +234 803 123 4567
            &bull; | 
            &bull;
            www.example.com
            &bull;
        </p>
      </section>
      <section className="education">
        <h2>EDUCATION</h2>
        <div className="items">
            <div className="item">
                <div className="item_heading">
                    <h3>College, Location</h3>
                    <div className="duration">Graduation Year</div>
                </div>
                <div className="details">
                        <div className="degree">Bachelor of Arts, GPA</div>
                        <p>relevant course work</p>
                </div>   
            </div>
        </div>
      </section>
      <section className="experience">
        <h2>PROFESSIONAL EXPERIENCE</h2>
        <div className="items">
            <div className="item">
                <div className="item_heading">
                    <h3>Company, Location</h3>
                    <div className="duration">Month Year</div>
                </div>
                <ul>
                    <li>Role: Describe what you did and what your impact was. Remember to be concise.</li>
                </ul>        
            </div>
        </div>
      </section>
      <section className="projects">
        <h2>PROJECTS & EXTRACURRICULAR</h2>
        <div className="items">
            <div className="item">
                <div className="item_heading">
                    <h3>Project title</h3>
                    <div className="duration">Month Year</div>
                </div>
                <p>Describe what you built etc.</p>
            </div>
            <div className="item">
                <div className="item_heading">
                    <h3>Activity</h3>
                    <div className="duration">Month Year</div>
                </div>
                <p>Describe what you built etc.</p>
            </div>
            <div className="item">
                <div className="item_heading">
                    <h3>Leadership experience</h3>
                    <div className="duration">Month Year</div>
                </div>
                <p>Describe what you built etc.</p>
            </div>
        </div>
      </section>
      <section className="skills">
        <h2>SKILLS</h2>
        <div className="item">
            <ul>
                <li><strong>Programming languages:</strong> List programming languages or skills</li>
                <li><strong>Computer software/frameworks:</strong> Microsoft, Adobe Photoshop, SQL, React</li>
                <li><strong>Languages:</strong> Portuguese (advanced), French (advanced)</li>
            </ul>
        </div>
      </section>
    </>
  );
}
    