import { Input } from "../ui/input";
import { Label } from "../ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Textarea } from "../ui/textarea";
import { Button } from "../ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "../ui/card";
import { Sparkles } from "lucide-react";

function CommonForm({
  formControls,
  formData,
  setFormData,
  onSubmit,
  buttonText,
  isBtnDisabled,
  title = "Swweet Surprises",
}) {
  function renderInputsByComponentType(getControlItem) {
    let element = null;
    const value = formData[getControlItem.name] || "";

    switch (getControlItem.componentType) {
      case "input":
        element = (
          <Input
            name={getControlItem.name}
            placeholder={getControlItem.placeholder}
            id={getControlItem.name}
            type={getControlItem.type}
            value={value}
            onChange={(event) =>
              setFormData({
                ...formData,
                [getControlItem.name]: event.target.value,
              })
            }
            className="border-pink-300 focus:ring-pink-400 focus:border-pink-400 rounded-lg bg-white shadow-sm transition-all duration-200 focus:shadow-md"
          />
        );
        break;
      case "select":
        element = (
          <Select
            onValueChange={(value) =>
              setFormData({
                ...formData,
                [getControlItem.name]: value,
              })
            }
            value={value}
          >
            <SelectTrigger className="w-full border-pink-300 focus:ring-pink-400 focus:border-pink-400 rounded-lg bg-white shadow-sm transition-all duration-200 focus:shadow-md">
              <SelectValue placeholder={getControlItem.label} />
            </SelectTrigger>
            <SelectContent className="bg-white border-pink-200">
              {getControlItem.options && getControlItem.options.length > 0
                ? getControlItem.options.map((optionItem) => (
                    <SelectItem
                      key={optionItem.id}
                      value={optionItem.id}
                      className="text-pink-900 hover:bg-pink-50 focus:bg-pink-100 transition-colors duration-200"
                    >
                      {optionItem.label}
                    </SelectItem>
                  ))
                : null}
            </SelectContent>
          </Select>
        );
        break;
      case "textarea":
        element = (
          <Textarea
            name={getControlItem.name}
            placeholder={getControlItem.placeholder}
            id={getControlItem.id}
            value={value}
            onChange={(event) =>
              setFormData({
                ...formData,
                [getControlItem.name]: event.target.value,
              })
            }
            className="border-pink-300 focus:ring-pink-400 focus:border-pink-400 rounded-lg bg-white shadow-sm min-h-24 transition-all duration-200 focus:shadow-md"
          />
        );
        break;

      default:
        element = (
          <Input
            name={getControlItem.name}
            placeholder={getControlItem.placeholder}
            id={getControlItem.name}
            type={getControlItem.type}
            value={value}
            onChange={(event) =>
              setFormData({
                ...formData,
                [getControlItem.name]: event.target.value,
              })
            }
            className="border-pink-300 focus:ring-pink-400 focus:border-pink-400 rounded-lg bg-white shadow-sm transition-all duration-200 focus:shadow-md"
          />
        );
        break;
    }

    return element;
  }

  return (
    <Card className="w-full bg-gradient-to-br from-pink-50 to-white shadow-lg border-pink-200 overflow-hidden">
      <CardHeader className="bg-pink-100 border-b border-pink-200">
        <CardTitle className="text-pink-800 flex items-center gap-2">
          <Sparkles className="h-4 w-4 text-pink-500" />
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-6">
        <form onSubmit={onSubmit} id="common-form">
          <div className="grid gap-5">
            {formControls.map((controlItem, index) => (
              <div key={controlItem.name} className="space-y-2 animate-fadeIn" style={{ animationDelay: `${index * 50}ms` }}>
                <Label 
                  htmlFor={controlItem.name} 
                  className="text-sm font-medium text-pink-700 flex items-center"
                >
                  {controlItem.label}
                  {controlItem.required && (
                    <span className="text-pink-500 ml-1">*</span>
                  )}
                </Label>
                {renderInputsByComponentType(controlItem)}
                {controlItem.helperText && (
                  <p className="text-xs text-pink-500 mt-1">{controlItem.helperText}</p>
                )}
              </div>
            ))}
          </div>
        </form>
      </CardContent>
      <CardFooter className="flex justify-end border-t border-pink-100 pt-4 pb-4 bg-gradient-to-r from-pink-50 to-white">
        <Button
          disabled={isBtnDisabled}
          type="submit"
          form="common-form"
          className="bg-gradient-to-r from-pink-500 to-pink-600 hover:from-pink-600 hover:to-pink-700 text-white shadow-md hover:shadow-lg transition-all duration-200 disabled:from-pink-300 disabled:to-pink-400 disabled:opacity-70"
        >
          {buttonText || "Submit"}
        </Button>
      </CardFooter>
    </Card>
  );
}

// Add a CSS keyframe animation for fade-in effect
const style = document.createElement('style');
style.textContent = `
@keyframes fadeIn {
  from { opacity: 0; transform: translateY(8px); }
  to { opacity: 1; transform: translateY(0); }
}
.animate-fadeIn {
  animation: fadeIn 0.3s ease-out forwards;
}
`;
document.head.appendChild(style);

export default CommonForm;