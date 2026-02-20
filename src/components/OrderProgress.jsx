import Stepper from "@mui/material/Stepper";
import Step from "@mui/material/Step";
import StepLabel from "@mui/material/StepLabel";

const steps = ["PENDING", "SHIPPED", "OUT FOR DELIVERY", "DELIVERED",  ]

const OrderProgress = ({ status }) => {
  const activeStep = steps.indexOf(status);

 return (
    <Stepper
      activeStep={activeStep}
      alternativeLabel
      sx={{
        "& .MuiStepLabel-root .Mui-completed": {
          color: "green",
        },
        "& .MuiStepLabel-root .Mui-active": {
          color: "green",
        },
        "& .MuiStepIcon-root": {
          fontSize: "14px", // icon size
        },
      }}
    >
      {steps.map((label) => (
        <Step key={label}>
          <StepLabel
            sx={{
              "& .MuiStepLabel-label": {
                fontSize: "12px",
              },
              "& .Mui-active": {
                fontWeight: "bold",
                fontSize: "12px",
              },
            }}
          >
            {label}
          </StepLabel>
        </Step>
      ))}
    </Stepper>
  );
};

export default OrderProgress;
