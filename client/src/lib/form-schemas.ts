import { z } from "zod";

const baseFormSchema = z.object({
  fullName: z.string().min(1, "Full name is required"),
  fatherName: z.string().min(1, "Father's name is required"),
  mobileNumber: z.string().regex(/^\d{10}$/, "Mobile number must be 10 digits"),
  email: z.string().email("Invalid email address").optional().or(z.literal("")),
  dob: z.string().min(1, "Date of birth is required"),
  annualIncome: z.string().min(1, "Annual income is required"),
  address: z.string().min(1, "Address is required"),
  state: z.string().min(1, "State is required"),
  district: z.string().min(1, "District is required"),
  pincode: z.string().regex(/^\d{6}$/, "PIN code must be 6 digits"),
  
  // New fields for photo, signature, and documents
  applicantPhoto: z.string().optional(),
  applicantSignature: z.string().optional(),
  identityDocument: z.string().optional(),
  addressProof: z.string().optional(),
  incomeDocument: z.string().optional(),
});

// Scheme-specific form schemas
const schemeFormSchemas = {
  "pradhan-mantri-ujjwala-yojana": baseFormSchema.extend({
    familySize: z.string().optional(),
    bplCardNumber: z.string().optional(),
  }),
  "ladli-behna-yojana": baseFormSchema.extend({
    maritalStatus: z.string().optional(),
    numberOfChildren: z.string().optional(),
  }),
  "mahila-samriddhi-yojana": baseFormSchema.extend({
    occupation: z.string().optional(),
    bankAccountNumber: z.string().optional(),
  }),
  "sukanya-samriddhi-yojana": baseFormSchema.extend({
    childName: z.string().optional(),
    childDob: z.string().optional(),
  }),
  "kishori-shakti-yojana": baseFormSchema.extend({
    educationLevel: z.string().optional(),
    schoolName: z.string().optional(),
  }),
  "cm-parivar-samridhi-yojana": baseFormSchema.extend({
    familyIncome: z.string().optional(),
    numberOfDependents: z.string().optional(),
  }),
};

export function getFormSchema(schemeId: string) {
  return schemeFormSchemas[schemeId as keyof typeof schemeFormSchemas] || baseFormSchema;
}

export { baseFormSchema };
