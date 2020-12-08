RETROSPECTIVE SPRINT 1 (Team 14)
=====================================

- [process measures](#process-measures)
- [quality measures](#quality-measures)
- [general assessment](#assessment)

## PROCESS MEASURES 

### Macro statistics

- Number of stories committed vs done: 
    - Stories committed: 5
    - Stories done: 5
- Total points committed vs done:
    - Total points committed: 15 
    - Total points done: 15
- Nr of hours planned vs spent (as a team)
    - Total hours planned: 72h
    - Total hours spent: 72h 18m 
 
- Unit Tests passing: 48
- Code review completed
- Code present on VCS
- End-to-End tests performed


### Detailed statistics

| Story  | # Tasks | Points | Hours est. | Hours actual |
|--------|---------|--------|------------|--------------|
| _#0_   |   10    |   -    |   59h 30m  |    58h 48m   |
| 1      |    2    |   5    |   4h       |    4h        |
| 2      |    1    |   3    |   2h       |    1h 40m    |
| 3      |    2    |   2    |   3h 15m   |    4h 20m    |
| 4      |    1    |   3    |   1h 30m   |    1h        |
| 5      |    2    |   2    |   1h 45m   |    2h 30m    |

- Hours per task (average, standard deviation): 
  - Average: 72.30/18 = 4.017h
  - Standard Deviation: 5.15h

- Total task estimation error ratio: 
    - Total hours estimated: 72h
    - Total hours spent: 72h 18m
        - Total task estimation error ratio: 72/72.30 = 0.9958
  
## QUALITY MEASURES 

- Unit Testing:
  - Total hours estimated: 15h
  - Total hours spent: 9h
  - Nr of automated unit test cases: 48
  - Coverage: 69.4%
- E2E testing:
  - Total hours estimated: 6h
  - Total hours spent: 1.5h
- Code review 
  - Total hours estimated: 9h
  - Total hours spent: 4.16h
- Technical Debt management:
  - Total hours estimated: 6h 
  - Total hours spent: 20m
  - Hours estimated for remediation by SonarQube: 32m
  - Hours spent on remediation: 20m
  - Debt ratio: 0.0%
  - Rating for each quality characteristic reported in SonarQube under "Measures":
    - Reliability: A
    - Security: A
    - Maintainability: A
  


## ASSESSMENT

- What caused your errors in estimation? Having estimated long times for activities that actually took little time (technical debt, which we expected to be a long effort and was actually something that we could fix in a few minutes of work; another thing was the creation of the email sending routine, which also didn't take as much time as expected).

- What lessons did you learn (both positive and negative) in this sprint?
  - To not trust too much SonarCloud estimation
  - To better manage time during the sprint, especially before the deadline

- Which improvement goals set in the previous retrospective were you able to achieve?
  
- Which ones you were not able to achieve? Why?

- Improvement goals for the next sprint and how to achieve them: (technical tasks, team coordination, etc.)
  - Perform a better estimation of stories and tasks
  - Perform more general checks on how the system works during the entire sprint

- One thing you are proud of as a Team:
  - The fact that our work introduced very little technical debt, requiring less work to fix it and allowing us to focus on other important tasks
