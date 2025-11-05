"use client";

import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

interface ApplicationFormProps {
  application: any;
  onClose: () => void;
  onSuccess: () => void;
}

export function ApplicationForm({
  application,
  onClose,
  onSuccess,
}: ApplicationFormProps) {
  const [formData, setFormData] = useState({
    full_name: "",
    address_line_1: "",
    address_line_2: "",
    city: "",
    state: "",
    pincode: "",
    email: "",
    phone: "",
    linkedin: "",
    professional_summary: "",
    yoe: 0,
    domain: "",
    expertise_skill_1: "",
    expertise_skill_2: "",
    expertise_skill_3: "",
    project_experience: "",
    current_ctc: 0,
    preferred_job_role: "",
    preferred_job_location: "",
    college_name: "",
    college_city: "",
    college_country: "",
    degree_discipline: "",
    cgpa: "",
    graduation_date: "",
    relevant_courses: "",
    school_name: "",
    school_city: "",
    school_country: "",
    higher_secondary_percentage: 0,
    school_completion_date: "",
    company_name: "",
    company_city: "",
    company_country: "",
    designation: "",
    work_from: "",
    work_to: "",
    work_summary: "",
    project_name: "",
    project_aim: "",
    tech_stack: "",
    achievements: "",
    published_paper: "",
    journal_name: "",
    volume_issue: "",
    publication_year: "",
    issn: "",
    technical_skills: "",
    languages: "",
    language_proficiency: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (application) {
      setFormData({
        full_name: application.full_name || "",
        address_line_1: application.address_line_1 || "",
        address_line_2: application.address_line_2 || "",
        city: application.city || "",
        state: application.state || "",
        pincode: application.pincode || "",
        email: application.email || "",
        phone: application.phone || "",
        linkedin: application.linkedin || "",
        professional_summary: application.professional_summary || "",
        yoe: application.yoe || 0,
        domain: application.domain?.join(", ") || "",
        expertise_skill_1: application.expertise_skill_1 || "",
        expertise_skill_2: application.expertise_skill_2 || "",
        expertise_skill_3: application.expertise_skill_3 || "",
        project_experience: application.project_experience || "",
        current_ctc: application.current_ctc || 0,
        preferred_job_role: application.preferred_job_role?.join(", ") || "",
        preferred_job_location:
          application.preferred_job_location?.join(", ") || "",
        college_name: application.college_name || "",
        college_city: application.college_city || "",
        college_country: application.college_country || "",
        degree_discipline: application.degree_discipline || "",
        cgpa: application.cgpa || "",
        graduation_date: application.graduation_date || "",
        relevant_courses: application.relevant_courses?.join(", ") || "",
        school_name: application.school_name || "",
        school_city: application.school_city || "",
        school_country: application.school_country || "",
        higher_secondary_percentage:
          application.higher_secondary_percentage || 0,
        school_completion_date: application.school_completion_date || "",
        company_name: application.company_name || "",
        company_city: application.company_city || "",
        company_country: application.company_country || "",
        designation: application.designation || "",
        work_from: application.work_from || "",
        work_to: application.work_to || "",
        work_summary: application.work_summary || "",
        project_name: application.project_name || "",
        project_aim: application.project_aim || "",
        tech_stack: application.tech_stack?.join(", ") || "",
        achievements: application.achievements?.join(", ") || "",
        published_paper: application.published_paper || "",
        journal_name: application.journal_name || "",
        volume_issue: application.volume_issue || "",
        publication_year: application.publication_year || "",
        issn: application.issn || "",
        technical_skills: application.technical_skills?.join(", ") || "",
        languages: application.languages?.join(", ") || "",
        language_proficiency: application.language_proficiency || "",
      });
    }
  }, [application]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const dataToSubmit = {
      ...formData,
      yoe: Number(formData.yoe),
      current_ctc: Number(formData.current_ctc),
      higher_secondary_percentage: Number(formData.higher_secondary_percentage),
      cgpa: formData.cgpa ? Number(formData.cgpa) : null,
      domain: formData.domain
        .split(",")
        .map((s) => s.trim())
        .filter((s) => s.length > 0),
      preferred_job_role: formData.preferred_job_role
        .split(",")
        .map((s) => s.trim())
        .filter((s) => s.length > 0),
      preferred_job_location: formData.preferred_job_location
        .split(",")
        .map((s) => s.trim())
        .filter((s) => s.length > 0),
      relevant_courses: formData.relevant_courses
        .split(",")
        .map((s) => s.trim())
        .filter((s) => s.length > 0),
      tech_stack: formData.tech_stack
        .split(",")
        .map((s) => s.trim())
        .filter((s) => s.length > 0),
      achievements: formData.achievements
        .split(",")
        .map((s) => s.trim())
        .filter((s) => s.length > 0),
      technical_skills: formData.technical_skills
        .split(",")
        .map((s) => s.trim())
        .filter((s) => s.length > 0),
      languages: formData.languages
        .split(",")
        .map((s) => s.trim())
        .filter((s) => s.length > 0),
    };

    try {
      if (application) {
        const response = await fetch(`/api/applications/${application.id}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(dataToSubmit),
        });

        if (!response.ok) {
          throw new Error("Failed to update application");
        }
      } else {
        const response = await fetch("/api/applications", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(dataToSubmit),
        });

        if (!response.ok) {
          throw new Error("Failed to create application");
        }
      }

      onSuccess();
    } catch (error) {
      console.error("Error submitting application:", error);
      // You might want to show an error message to the user here
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent aria-describedby="Application form dialog" className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {application ? "Edit Application" : "Add Application"}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <Accordion
            type="single"
            collapsible
            defaultValue="personal"
            className="w-full"
          >
            <AccordionItem value="personal">
              <AccordionTrigger>Personal Details</AccordionTrigger>
              <AccordionContent className="space-y-4 pt-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="full_name">Full Name *</Label>
                    <Input
                      id="full_name"
                      value={formData.full_name}
                      onChange={(e) =>
                        setFormData({ ...formData, full_name: e.target.value })
                      }
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="email">Email *</Label>
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) =>
                        setFormData({ ...formData, email: e.target.value })
                      }
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="phone">Phone</Label>
                    <Input
                      id="phone"
                      value={formData.phone}
                      onChange={(e) =>
                        setFormData({ ...formData, phone: e.target.value })
                      }
                    />
                  </div>
                  <div>
                    <Label htmlFor="linkedin">LinkedIn</Label>
                    <Input
                      id="linkedin"
                      value={formData.linkedin}
                      onChange={(e) =>
                        setFormData({ ...formData, linkedin: e.target.value })
                      }
                    />
                  </div>
                  <div className="col-span-2">
                    <Label htmlFor="address_line_1">Address Line 1</Label>
                    <Input
                      id="address_line_1"
                      value={formData.address_line_1}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          address_line_1: e.target.value,
                        })
                      }
                    />
                  </div>
                  <div className="col-span-2">
                    <Label htmlFor="address_line_2">Address Line 2</Label>
                    <Input
                      id="address_line_2"
                      value={formData.address_line_2}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          address_line_2: e.target.value,
                        })
                      }
                    />
                  </div>
                  <div>
                    <Label htmlFor="city">City</Label>
                    <Input
                      id="city"
                      value={formData.city}
                      onChange={(e) =>
                        setFormData({ ...formData, city: e.target.value })
                      }
                    />
                  </div>
                  <div>
                    <Label htmlFor="state">State</Label>
                    <Input
                      id="state"
                      value={formData.state}
                      onChange={(e) =>
                        setFormData({ ...formData, state: e.target.value })
                      }
                    />
                  </div>
                  <div>
                    <Label htmlFor="pincode">Pincode</Label>
                    <Input
                      id="pincode"
                      value={formData.pincode}
                      onChange={(e) =>
                        setFormData({ ...formData, pincode: e.target.value })
                      }
                    />
                  </div>
                </div>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="professional">
              <AccordionTrigger>Professional Summary</AccordionTrigger>
              <AccordionContent className="space-y-4 pt-4">
                <div>
                  <Label htmlFor="professional_summary">
                    Professional Summary
                  </Label>
                  <Textarea
                    id="professional_summary"
                    value={formData.professional_summary}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        professional_summary: e.target.value,
                      })
                    }
                    rows={3}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="yoe">Years of Experience</Label>
                    <Input
                      id="yoe"
                      type="number"
                      value={formData.yoe}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          yoe: parseInt(e.target.value) || 0,
                        })
                      }
                    />
                  </div>
                  <div>
                    <Label htmlFor="current_ctc">Current CTC (LPA)</Label>
                    <Input
                      id="current_ctc"
                      type="number"
                      value={formData.current_ctc}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          current_ctc: parseInt(e.target.value) || 0,
                        })
                      }
                    />
                  </div>
                  <div className="col-span-2">
                    <Label htmlFor="domain">Domain (comma-separated)</Label>
                    <Input
                      id="domain"
                      value={formData.domain}
                      onChange={(e) =>
                        setFormData({ ...formData, domain: e.target.value })
                      }
                      placeholder="e.g., Data Science, Web Development"
                    />
                  </div>
                  <div>
                    <Label htmlFor="expertise_skill_1">Expertise Skill 1</Label>
                    <Input
                      id="expertise_skill_1"
                      value={formData.expertise_skill_1}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          expertise_skill_1: e.target.value,
                        })
                      }
                    />
                  </div>
                  <div>
                    <Label htmlFor="expertise_skill_2">Expertise Skill 2</Label>
                    <Input
                      id="expertise_skill_2"
                      value={formData.expertise_skill_2}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          expertise_skill_2: e.target.value,
                        })
                      }
                    />
                  </div>
                  <div>
                    <Label htmlFor="expertise_skill_3">Expertise Skill 3</Label>
                    <Input
                      id="expertise_skill_3"
                      value={formData.expertise_skill_3}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          expertise_skill_3: e.target.value,
                        })
                      }
                    />
                  </div>
                  <div className="col-span-2">
                    <Label htmlFor="project_experience">
                      Project Experience
                    </Label>
                    <Textarea
                      id="project_experience"
                      value={formData.project_experience}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          project_experience: e.target.value,
                        })
                      }
                      rows={3}
                    />
                  </div>
                  <div className="col-span-2">
                    <Label htmlFor="preferred_job_role">
                      Preferred Job Role (comma-separated)
                    </Label>
                    <Input
                      id="preferred_job_role"
                      value={formData.preferred_job_role}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          preferred_job_role: e.target.value,
                        })
                      }
                    />
                  </div>
                  <div className="col-span-2">
                    <Label htmlFor="preferred_job_location">
                      Preferred Job Location (comma-separated)
                    </Label>
                    <Input
                      id="preferred_job_location"
                      value={formData.preferred_job_location}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          preferred_job_location: e.target.value,
                        })
                      }
                    />
                  </div>
                </div>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="education">
              <AccordionTrigger>Education</AccordionTrigger>
              <AccordionContent className="space-y-4 pt-4">
                <h4 className="font-medium">College Education</h4>
                <div className="grid grid-cols-2 gap-4">
                  <div className="col-span-2">
                    <Label htmlFor="college_name">College Name</Label>
                    <Input
                      id="college_name"
                      value={formData.college_name}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          college_name: e.target.value,
                        })
                      }
                    />
                  </div>
                  <div>
                    <Label htmlFor="college_city">City</Label>
                    <Input
                      id="college_city"
                      value={formData.college_city}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          college_city: e.target.value,
                        })
                      }
                    />
                  </div>
                  <div>
                    <Label htmlFor="college_country">Country</Label>
                    <Input
                      id="college_country"
                      value={formData.college_country}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          college_country: e.target.value,
                        })
                      }
                    />
                  </div>
                  <div>
                    <Label htmlFor="degree_discipline">Degree/Discipline</Label>
                    <Input
                      id="degree_discipline"
                      value={formData.degree_discipline}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          degree_discipline: e.target.value,
                        })
                      }
                    />
                  </div>
                  <div>
                    <Label htmlFor="cgpa">CGPA</Label>
                    <Input
                      id="cgpa"
                      type="number"
                      step="0.01"
                      value={formData.cgpa}
                      onChange={(e) =>
                        setFormData({ ...formData, cgpa: e.target.value })
                      }
                    />
                  </div>
                  <div>
                    <Label htmlFor="graduation_date">
                      Graduation Date (mm/yyyy)
                    </Label>
                    <Input
                      id="graduation_date"
                      value={formData.graduation_date}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          graduation_date: e.target.value,
                        })
                      }
                      placeholder="06/2024"
                    />
                  </div>
                  <div className="col-span-2">
                    <Label htmlFor="relevant_courses">
                      Relevant Courses (comma-separated)
                    </Label>
                    <Input
                      id="relevant_courses"
                      value={formData.relevant_courses}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          relevant_courses: e.target.value,
                        })
                      }
                    />
                  </div>
                </div>

                <h4 className="font-medium pt-4">School Education</h4>
                <div className="grid grid-cols-2 gap-4">
                  <div className="col-span-2">
                    <Label htmlFor="school_name">School Name</Label>
                    <Input
                      id="school_name"
                      value={formData.school_name}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          school_name: e.target.value,
                        })
                      }
                    />
                  </div>
                  <div>
                    <Label htmlFor="school_city">City</Label>
                    <Input
                      id="school_city"
                      value={formData.school_city}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          school_city: e.target.value,
                        })
                      }
                    />
                  </div>
                  <div>
                    <Label htmlFor="school_country">Country</Label>
                    <Input
                      id="school_country"
                      value={formData.school_country}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          school_country: e.target.value,
                        })
                      }
                    />
                  </div>
                  <div>
                    <Label htmlFor="higher_secondary_percentage">
                      Higher Secondary Percentage
                    </Label>
                    <Input
                      id="higher_secondary_percentage"
                      type="number"
                      value={formData.higher_secondary_percentage}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          higher_secondary_percentage:
                            parseInt(e.target.value) || 0,
                        })
                      }
                    />
                  </div>
                  <div>
                    <Label htmlFor="school_completion_date">
                      Completion Date (mm/yyyy)
                    </Label>
                    <Input
                      id="school_completion_date"
                      value={formData.school_completion_date}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          school_completion_date: e.target.value,
                        })
                      }
                      placeholder="06/2020"
                    />
                  </div>
                </div>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="experience">
              <AccordionTrigger>Professional Experience</AccordionTrigger>
              <AccordionContent className="space-y-4 pt-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="col-span-2">
                    <Label htmlFor="company_name">Company Name</Label>
                    <Input
                      id="company_name"
                      value={formData.company_name}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          company_name: e.target.value,
                        })
                      }
                    />
                  </div>
                  <div>
                    <Label htmlFor="company_city">City</Label>
                    <Input
                      id="company_city"
                      value={formData.company_city}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          company_city: e.target.value,
                        })
                      }
                    />
                  </div>
                  <div>
                    <Label htmlFor="company_country">Country</Label>
                    <Input
                      id="company_country"
                      value={formData.company_country}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          company_country: e.target.value,
                        })
                      }
                    />
                  </div>
                  <div>
                    <Label htmlFor="designation">Designation</Label>
                    <Input
                      id="designation"
                      value={formData.designation}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          designation: e.target.value,
                        })
                      }
                    />
                  </div>
                  <div>
                    <Label htmlFor="work_from">Work From (mm/yyyy)</Label>
                    <Input
                      id="work_from"
                      value={formData.work_from}
                      onChange={(e) =>
                        setFormData({ ...formData, work_from: e.target.value })
                      }
                      placeholder="01/2020"
                    />
                  </div>
                  <div>
                    <Label htmlFor="work_to">Work To (mm/yyyy)</Label>
                    <Input
                      id="work_to"
                      value={formData.work_to}
                      onChange={(e) =>
                        setFormData({ ...formData, work_to: e.target.value })
                      }
                      placeholder="12/2023"
                    />
                  </div>
                  <div className="col-span-2">
                    <Label htmlFor="work_summary">Work Summary</Label>
                    <Textarea
                      id="work_summary"
                      value={formData.work_summary}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          work_summary: e.target.value,
                        })
                      }
                      rows={3}
                    />
                  </div>
                </div>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="projects">
              <AccordionTrigger>
                Academic Projects & Publications
              </AccordionTrigger>
              <AccordionContent className="space-y-4 pt-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="col-span-2">
                    <Label htmlFor="project_name">Project Name</Label>
                    <Input
                      id="project_name"
                      value={formData.project_name}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          project_name: e.target.value,
                        })
                      }
                    />
                  </div>
                  <div className="col-span-2">
                    <Label htmlFor="project_aim">Project Aim</Label>
                    <Textarea
                      id="project_aim"
                      value={formData.project_aim}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          project_aim: e.target.value,
                        })
                      }
                      rows={2}
                    />
                  </div>
                  <div className="col-span-2">
                    <Label htmlFor="tech_stack">
                      Tech Stack (comma-separated)
                    </Label>
                    <Input
                      id="tech_stack"
                      value={formData.tech_stack}
                      onChange={(e) =>
                        setFormData({ ...formData, tech_stack: e.target.value })
                      }
                    />
                  </div>
                  <div className="col-span-2">
                    <Label htmlFor="achievements">
                      Achievements (comma-separated)
                    </Label>
                    <Input
                      id="achievements"
                      value={formData.achievements}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          achievements: e.target.value,
                        })
                      }
                    />
                  </div>
                  <div className="col-span-2">
                    <Label htmlFor="published_paper">Published Paper</Label>
                    <Input
                      id="published_paper"
                      value={formData.published_paper}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          published_paper: e.target.value,
                        })
                      }
                    />
                  </div>
                  <div>
                    <Label htmlFor="journal_name">Journal Name</Label>
                    <Input
                      id="journal_name"
                      value={formData.journal_name}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          journal_name: e.target.value,
                        })
                      }
                    />
                  </div>
                  <div>
                    <Label htmlFor="volume_issue">Volume/Issue</Label>
                    <Input
                      id="volume_issue"
                      value={formData.volume_issue}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          volume_issue: e.target.value,
                        })
                      }
                    />
                  </div>
                  <div>
                    <Label htmlFor="publication_year">Publication Year</Label>
                    <Input
                      id="publication_year"
                      value={formData.publication_year}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          publication_year: e.target.value,
                        })
                      }
                    />
                  </div>
                  <div>
                    <Label htmlFor="issn">ISSN</Label>
                    <Input
                      id="issn"
                      value={formData.issn}
                      onChange={(e) =>
                        setFormData({ ...formData, issn: e.target.value })
                      }
                    />
                  </div>
                </div>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="skills">
              <AccordionTrigger>Technical Skills & Languages</AccordionTrigger>
              <AccordionContent className="space-y-4 pt-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="col-span-2">
                    <Label htmlFor="technical_skills">
                      Technical Skills (comma-separated)
                    </Label>
                    <Input
                      id="technical_skills"
                      value={formData.technical_skills}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          technical_skills: e.target.value,
                        })
                      }
                      placeholder="Python, SQL, React, etc."
                    />
                  </div>
                  <div>
                    <Label htmlFor="languages">
                      Languages (comma-separated)
                    </Label>
                    <Input
                      id="languages"
                      value={formData.languages}
                      onChange={(e) =>
                        setFormData({ ...formData, languages: e.target.value })
                      }
                      placeholder="English, Hindi, etc."
                    />
                  </div>
                  <div>
                    <Label htmlFor="language_proficiency">
                      Language Proficiency
                    </Label>
                    <Input
                      id="language_proficiency"
                      value={formData.language_proficiency}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          language_proficiency: e.target.value,
                        })
                      }
                      placeholder="Basic/Intermediate/Advanced"
                    />
                  </div>
                </div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>

          <div className="flex gap-2 justify-end pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Saving..." : application ? "Update" : "Create"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
