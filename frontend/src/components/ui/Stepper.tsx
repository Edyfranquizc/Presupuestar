// Stepper.tsx — Indicador visual de pasos (ej: paso 1 de 3)

interface StepperProps {
  totalSteps: number;
  currentStep: number;
}

export default function Stepper({ totalSteps, currentStep }: StepperProps) {
  return (
    <div className="flex items-center gap-2">
      {Array.from({ length: totalSteps }).map((_, index) => {
        const stepNumber = index + 1;
        const isCompleted = stepNumber < currentStep;
        const isCurrent = stepNumber === currentStep;
        return (
          <div key={stepNumber} className="flex items-center gap-2">
            <div
              className={`
              w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold
              ${isCurrent ? "bg-black text-white" : ""}
              ${isCompleted ? "bg-gray-400 text-white" : ""}
              ${!isCurrent && !isCompleted ? "border-2 border-gray-300 text-gray-400" : ""}
            `}
            >
              {isCompleted ? "✓" : stepNumber}
            </div>

            {stepNumber < totalSteps && (
              <div
                className={`h-px w-6 ${isCompleted ? "bg-gray-400" : "bg-gray-200"}`}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}
