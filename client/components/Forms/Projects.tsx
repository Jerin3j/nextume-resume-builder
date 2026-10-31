import axiosInstance from "@/app/utils/axiosInstance";
import {
  closestCenter,
  DndContext,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { GripHorizontal, Loader2, Plus, Sparkles, Trash2 } from "lucide-react";
import { useState } from "react";
import { v4 as uuid } from "uuid";
import toast from "react-hot-toast";

type Project = {
  id: string;
  name: string;
  type: string;
  description: string;
};

type ProjectsProps = {
  data: Project[];
  onChange: (value: Project[]) => void;
};

const Projects = ({ data, onChange }: ProjectsProps) => {
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } })
  );

  const handleDragEnd = (event: any) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;
    const oldIndex = data.findIndex((p) => p.id === active.id);
    const newIndex = data.findIndex((p) => p.id === over.id);
    onChange(arrayMove(data, oldIndex, newIndex));
  };

  const addProject = () => {
    const newProject: Project = {
      id: uuid(),
      name: "",
      type: "",
      description: "",
    };
    onChange([...data, newProject]);
  };

  const removeProject = (id: string) => {
    onChange(data.filter((p) => p.id !== id));
  };

  const updateProject = (
    id: string,
    fieldOrUpdates: keyof Project | Partial<Project>,
    value?: string
  ) => {
    onChange(
      data?.map((p) => {
        if (p.id !== id) return p;
        if (typeof fieldOrUpdates === "object") {
          return { ...p, ...fieldOrUpdates };
        }
        return { ...p, [fieldOrUpdates]: value as string };
      })
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="flex items-center gap-2 text-lg font-semibold text-gray-900">
            Projects
          </h3>
          <p className="text-sm text-gray-500">Add your project details here</p>
        </div>
        <button
          onClick={addProject}
          className="flex items-center gap-2 px-3 py-1 text-sm bg-orange-100 text-orange-700 rounded-lg hover:bg-orange-200 transition-colors"
        >
          <Plus className="w-4 h-4" />
          Add project
        </button>
      </div>

      {/* Drag + Sortable list */}
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <SortableContext
          items={(data ?? []).map((p) => p.id)}
          strategy={verticalListSortingStrategy}
        >
          <div className="space-y-4">
            {data?.map((project, index) => (
              <SortableProject key={project.id} id={project.id}>
                <ProjectCard
                  index={index}
                  project={project}
                  onRemove={removeProject}
                  onUpdate={updateProject}
                />
              </SortableProject>
            ))}
          </div>
        </SortableContext>
      </DndContext>
    </div>
  );
};

/*  Sortable wrapper — handles drag, but not inputs */
const SortableProject = ({
  id,
  children,
}: {
  id: string;
  children: React.ReactNode;
}) => {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="p-4 border border-gray-200 rounded-lg space-y-3 bg-white"
    >
      {/* Drag handle */}
      <div
        {...attributes}
        {...listeners}
        className="cursor-grab text-slate-600 active:cursor-grabbing w-fit"
      >
        <GripHorizontal className="w-4 h-4" />
      </div>

      {children}
    </div>
  );
};

/*  The editable project UI */
const ProjectCard = ({
  index,
  project,
  onRemove,
  onUpdate,
}: {
  index: number;
  project: Project;
  onRemove: (id: string) => void;
  onUpdate: (
    id: string,
    fieldOrUpdates: keyof Project | Partial<Project>,
    value?: string
  ) => void;
}) => {
  const [isGenerating, setIsGenerating] = useState(false);

  const generateEnhancement = async () => {
    if (!project.description?.trim()) {
      toast.error("Please describe your project before enhancing.");
      return;
    }

    try {
      setIsGenerating(true);

      const response = await axiosInstance.post("/ai/enhance-project", {
        name: project.name || "Project",
        type: project.type || "Full-Stack Project",
        description: project.description,
      });

      if (!response.data) {
        throw new Error("Failed to enhance project");
      }

      let data = response.data.enhancedContent;
      if (typeof data === "string") {
        try {
          const cleaned = data.replace(/```json\s*|\s*```/g, "").trim();
          data = JSON.parse(cleaned);
        } catch {
          data = { description: data };
        }
      }

      const updates: Partial<Project> = {};
      if (data?.description) updates.description = data.description;
      if (data?.name) updates.name = data.name;
      if (data?.type) updates.type = data.type;

      if (Object.keys(updates).length > 0) {
        onUpdate(project.id, updates);
        toast.success("Project enhanced successfully!");
      } else {
        toast.error("Could not extract enhanced content.");
      }
    } catch (error: any) {
      console.error("Enhancement error:", error);
      toast.error(error?.response?.data?.message || "Failed to enhance project");
    } finally {
      setIsGenerating(false);
    }
  };

  const isDescEmpty = !project.description || !project.description.trim();

  return (
    <>
      {/* Top row */}
      <div className="flex gap-3 items-center justify-between w-full">
        <h4 className="flex-1 font-medium">Project #{index + 1}</h4>

        <div className="flex items-center gap-2">
          <button
            type="button"
            disabled={isGenerating || isDescEmpty}
            onClick={generateEnhancement}
            className="flex items-center gap-2 px-3 py-1 text-sm bg-purple-100 text-purple-700 rounded hover:bg-purple-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isGenerating ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Sparkles className="w-4 h-4" />
            )}
            {isGenerating ? "Enhancing..." : "AI Enhance"}
          </button>

          <button
            type="button"
            onClick={() => onRemove(project.id)}
            className="transition-colors text-red-500 hover:text-red-700"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Inputs */}
      <div className="grid gap-3">
        <input
          type="text"
          value={project.name}
          disabled={isGenerating}
          onChange={(e) => onUpdate(project.id, "name", e.target.value)}
          onPointerDown={(e) => e.stopPropagation()}
          placeholder="Project Name"
          className={`px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all ${
            isGenerating
              ? "opacity-70 cursor-not-allowed blur-[1px] animate-pulse"
              : "text-gray-900"
          }`}
        />

        <input
          type="text"
          value={project.type}
          disabled={isGenerating}
          onChange={(e) => onUpdate(project.id, "type", e.target.value)}
          onPointerDown={(e) => e.stopPropagation()}
          placeholder="Project Type"
          className={`px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all ${
            isGenerating
              ? "opacity-70 cursor-not-allowed blur-[1px] animate-pulse"
              : "text-gray-900"
          }`}
        />

        <textarea
          rows={4}
          value={project.description}
          disabled={isGenerating}
          onChange={(e) =>
            onUpdate(project.id, "description", e.target.value)
          }
          onPointerDown={(e) => e.stopPropagation()}
          placeholder="Describe Your Project"
          className={`px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none transition-all ${
            isGenerating
              ? "opacity-70 cursor-not-allowed blur-[1px] animate-pulse"
              : "text-gray-900"
          }`}
        />
      </div>
    </>
  );
};

export default Projects;
