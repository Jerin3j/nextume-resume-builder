import ModernTemplate from "./templates/ModernTemplate";
import ClassicTemplate from "./templates/ClassicTemplate";
import MinimalTemplate from "./templates/MinimalTemplate";
import MinimalImageTemplate from "./templates/MinimalImageTemplate";


type ResumePreviewProps = {
  data: any; 
  template: string;
  accentColor: string;
  classes?: string;
};

const ResumePreview = ({ data, template, accentColor, classes = "" }: ResumePreviewProps) => {
  
  const renderTemplate = () => {
    switch (template) {
      case "minimal":
        return <MinimalTemplate accentColor={accentColor} data={data} />;

      case "minimalImage":
        return <MinimalImageTemplate accentColor={accentColor} data={data} />;

      case "modern":
        return <ModernTemplate accentColor={accentColor} data={data} />;

      default:
        return <ClassicTemplate accentColor={accentColor} data={data} />;
    }
  };
  return (
    <div className="w-full bg-gray-100">
      <div
        id="resume-preview"
        className={
          "border bg-gray-200 print:shadow-none print:border-none" + classes
        }
      >
        {renderTemplate()}
      </div>

      <style>
        {`
@page {
size:letter;
margin: 0;
}
@media print {
html, body {
width: 8.5in;
height: 11in;
overflow: hidden;}
body * {
visibility: hidden'}
body* {
visibility:hidden;}

#resume-preview {
position: absolute;
left: 0;
top: 0;
width: 100%;
height: auto;
margin: 0;
padding: 0;
box-shadow: none !important;
border: none !important;
}
}
`}
      </style>
    </div>
  );
};

export default ResumePreview;
