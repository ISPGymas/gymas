export enum GenderEnum {
  MALE = 'Male',
  FEMALE = 'Female',
}

export enum ActivityLevelEnum {
  LEVEL1 = 'sedentary job, workout 1-2 times per week',
  LEVEL2 = 'physical job, workout 1-2 times per week',
  LEVEL3 = 'sedentary job, workout 3-5 times per week',
  LEVEL4 = 'physical job, workout 3-5 times per week',
  LEVEL5 = 'sedentary job, workout 6-7 times per week',
  LEVEL6 = 'physical job, workout 6-7 times per week',
}

export enum EmploymentTypeEnum {
  FULL_TIME = 'Full-time',
  PART_TIME = 'Part-time',
}

export enum EducationLevelEnum {
  PRIMARY = 'Primary',
  MIDDLE = 'Middle',
  SECONDARY = 'Secondary',
  PROFESSIONAL = 'Professional',
  HIGHER = 'Higher',
}

export type User = {
  id: string
  firstName: string
  lastName: string
  email: string
  phone: string
  avatar?: string
}

export type GymClient = {
  userId: string
  gender: GenderEnum
  age: number
  weight: number
  heigth: number
  activity: ActivityLevelEnum
  disabilities?: string
  alergies?: string
}

export type Trainer = {
  userId: string
  salary: number
  experience: number
  education: EducationLevelEnum
}

export type Administrator = {
  userId: string
  salary: number
  employment_type: EmploymentTypeEnum
}
