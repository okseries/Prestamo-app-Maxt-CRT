import React, { useState } from 'react';
import { Grid } from '@mui/material';

import CalculadoraPrestamo from './CalculadoraPrestamo';
import Box from '@mui/material/Box';
import Stepper from '@mui/material/Stepper';
import Step from '@mui/material/Step';
import StepLabel from '@mui/material/StepLabel';
import CalculadoraMora from './CalculadoraMoras';
import { ContainerComp } from 'app/components/ContainerComp';

const steps = ['Calculadora de Préstamo', 'Calculadora de Mora'];

const Calculadora = () => {
  const [activeStep, setActiveStep] = useState(0);

  const handleStepClick = (stepIndex) => {
    setActiveStep(stepIndex);
  };

  return (
    <ContainerComp>
      <Grid container spacing={2}>
        <Grid item md={12} xs={12}>
          {activeStep === 0 && <CalculadoraPrestamo />}
          {activeStep === 1 && <CalculadoraMora />}
        </Grid>
        <Grid item md={12} xs={12}>
          <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
            <Stepper activeStep={activeStep} alternativeLabel>
              {steps.map((label, index) => (
                <Step key={label} onClick={() => handleStepClick(index)}>
                  <StepLabel />
                </Step>
              ))}
            </Stepper>
          </Box>
        </Grid>
      </Grid>
    </ContainerComp>
  );
};

export default Calculadora;
