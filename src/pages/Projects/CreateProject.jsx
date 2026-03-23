import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { createProject } from "../../api/project.api";
import { useNavigate } from "react-router-dom";
import Button from "../../components/common/Button";
import { Card, CardHeader, CardBody, CardTitle, CardDescription } from "../../components/common/Card";
import { cn } from "../../utils";
import "./CreateProject.css";

const CreateProject = () => {
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    watch,
    reset,
    setError
  } = useForm({
    defaultValues: {
      name: "",
      description: "",
      start_date: "",
      end_date: "",
      status: "PLANNED"
    }
  });

  const [submitSuccess, setSubmitSuccess] = useState(false);
  const today = new Date().toISOString().split("T")[0];

  const onSubmit = async (data) => {
    try {
      setSubmitSuccess(false);

      // ✅ CORRECT PAYLOAD (MATCH BACKEND)
      const projectData = {
        name: data.name.trim(),
        description: data.description.trim(),
        startDate: data.start_date,   // ✅ FIXED
        endDate: data.end_date,       // ✅ FIXED
        status: data.status || "PLANNED"
      };

      console.log("🚀 FINAL PAYLOAD:", projectData);

      const response = await createProject(projectData);

      console.log("✅ API RESPONSE:", response);

      setSubmitSuccess(true);
      reset();

      setTimeout(() => {
        navigate("/projects");
      }, 1500);

    } catch (err) {
      console.error("❌ ERROR:", err);

      setError("submit", {
        message:
          err?.response?.data?.message ||
          err?.response?.data?.error ||
          "Failed to create project"
      });
    }
  };

  const handleCancel = () => {
    navigate("/projects");
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "PLANNED": return "#6b7280";
      case "ACTIVE": return "#dc2626";
      case "COMPLETED": return "#10b981";
      default: return "#6b7280";
    }
  };

  return (
    <div className="create-project-container">
      <Card variant="default" shadow="md" className="create-project-header">
        <CardBody className="create-project-header-body">
          <Button onClick={handleCancel} variant="ghost" size="sm" className="back-btn">
            ← Back
          </Button>
          <CardTitle className="page-title">Create New Project</CardTitle>
        </CardBody>
      </Card>

      <Card variant="primary" shadow="lg" className="create-project-form">
        <CardBody className="create-project-form-body">
          {submitSuccess && (
            <div className={cn("success-message", styles.successAlert)}>
              <div className="success-icon">✓</div>
              <p>Project created successfully!</p>
            </div>
          )}

          {errors.submit && (
            <div className={cn("error-message", styles.errorAlert)}>
              <p>{errors.submit.message}</p>
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)}>

          {/* Name */}
          <div className="form-group">
            <label>Project Name *</label>
            <input
              type="text"
              {...register("name", { required: true, minLength: 3 })}
            />
          </div>

          {/* Description */}
          <div className="form-group">
            <label>Description *</label>
            <textarea
              rows="4"
              {...register("description", { required: true, minLength: 10 })}
            />
          </div>

          {/* Dates */}
          <div className="form-row">
            <div className="form-group">
              <label>Start Date *</label>
              <input
                type="date"
                min={today}
                {...register("start_date", { required: true })}
              />
            </div>

            <div className="form-group">
              <label>End Date *</label>
              <input
                type="date"
                min={watch("start_date") || today}
                {...register("end_date", { required: true })}
              />
            </div>
          </div>

          {/* Status */}
          <div className="form-group">
            <label>Status *</label>
            <div className="status-options">
              {["PLANNED", "ACTIVE", "COMPLETED"].map((status) => (
                <label key={status}>
                  <input
                    type="radio"
                    value={status}
                    {...register("status")}
                  />
                  <span style={{ background: getStatusColor(status) }}></span>
                  {status}
                </label>
              ))}
            </div>
          </div>

          {/* Buttons */}
          <div className="form-actions">
            <Button type="button" onClick={handleCancel} variant="secondary" size="md">
              Cancel
            </Button>

            <Button type="submit" variant="primary" size="lg" disabled={isSubmitting} loading={isSubmitting}>
              {isSubmitting ? "Creating..." : "Create Project"}
            </Button>
          </div>

        </form>
        </CardBody>
      </Card>
    </div>
  );
};

export default CreateProject;