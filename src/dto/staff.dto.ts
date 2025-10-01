import { z } from 'zod';

/*************************************************************
 *                       Create Staff
 ************************************************************/
const CreateStaffRequestSchema = z.object({
    email: z.string({ message: "email is required" })
        .email("Invalid email format")
        .min(1, "email is required")
        .max(255, "email must be less than 255 characters"),
    name: z.string()
        .min(1, "name must be at least 1 character")
        .max(100, "name must be less than 100 characters")
        .optional(),
    roleId: z.number({ message: "roleId is required" })
        .int("roleId must be an integer")
        .positive("roleId must be a positive number"),
    password: z.string({ message: "password is required" })
        .min(6, "password must be at least 6 characters")
        .max(255, "password must be less than 255 characters"),
});

type CreateStaffRequestType = z.infer<typeof CreateStaffRequestSchema>;

export class CreateStaffRequestDto implements CreateStaffRequestType {
    email: string = '';
    name?: string;
    roleId: number = 0;
    password: string = '';

    constructor(data: Partial<CreateStaffRequestDto> = {}) {
        Object.assign(this, data);
    }

    validate(): CreateStaffRequestDto {
        const result = CreateStaffRequestSchema.safeParse(this);
        if (!result.success) {
            throw result.error;
        }
        return result.data as CreateStaffRequestDto;
    }
}

export class CreateStaffResponseDto {
    id!: number;
    email!: string;
    name?: string;
    roleId!: number;
    createdAt!: Date;
    updatedAt!: Date;

    constructor(data: Partial<CreateStaffResponseDto> = {}) {
        Object.assign(this, data);
    }
}

/*************************************************************
 *                       Get Staff By Id
 ************************************************************/
const GetStaffByIdRequestSchema = z.object({
    id: z.number({ message: "id is required" })
        .int("id must be an integer")
        .positive("id must be a positive number")
});

type GetStaffByIdRequestType = z.infer<typeof GetStaffByIdRequestSchema>;

export class GetStaffByIdRequestDto implements GetStaffByIdRequestType {
    id: number = 0;
    constructor(data: Partial<GetStaffByIdRequestDto> = {}) {
        Object.assign(this, data);
    }
    validate(): GetStaffByIdRequestDto {
        const result = GetStaffByIdRequestSchema.safeParse(this);
        if (!result.success) {
            throw result.error;
        }
        return result.data as GetStaffByIdRequestDto;
    }
}

export class GetStaffByIdResponseDto {
    id!: number;
    email!: string;
    name?: string;
    roleId!: number;
    createdAt!: Date;
    updatedAt!: Date;

    constructor(data: Partial<GetStaffByIdResponseDto> = {}) {
        Object.assign(this, data);
    }
}

/*************************************************************
 *                       Get All Staffs
 ************************************************************/
const GetAllStaffsRequestSchema = z.object({
    limit: z.number()
        .int("limit must be an integer")
        .min(1, "limit must be at least 1")
        .max(100, "limit must be at most 100")
        .optional(),
    offset: z.number()
        .int("offset must be an integer")
        .min(0, "offset must be at least 0")
        .optional(),
    orderBy: z.object({
        field: z.enum(['id', 'email', 'name', 'createdAt', 'updatedAt']),
        direction: z.enum(['asc', 'desc'])
    }).optional(),
});

type GetAllStaffsRequestType = z.infer<typeof GetAllStaffsRequestSchema>;

export class GetAllStaffsRequestDto implements GetAllStaffsRequestType {
    limit?: number;
    offset?: number;
    orderBy?: {
        field: 'id' | 'email' | 'name' | 'createdAt' | 'updatedAt';
        direction: 'asc' | 'desc';
    };

    constructor(data: Partial<GetAllStaffsRequestDto> = {}) {
        Object.assign(this, data);
    }

    validate(): GetAllStaffsRequestDto {
        const result = GetAllStaffsRequestSchema.safeParse(this);
        if (!result.success) {
            throw result.error;
        }
        return result.data as GetAllStaffsRequestDto;
    }
}

export class GetAllStaffsResponseDto {
    staffs: {
        id: number;
        email: string;
        name?: string;
        roleId: number;
        createdAt: Date;
        updatedAt: Date;
    }[] = [];
    total: number = 0;

    constructor(data: Partial<GetAllStaffsResponseDto> = { staffs: [], total: 0 }) {
        Object.assign(this, data);
    }
}

/*************************************************************
 *                       Update Staff
 ************************************************************/
const UpdateStaffRequestSchema = z.object({
    id: z.number({ message: "id is required" })
        .int("id must be an integer")
        .positive("id must be a positive number"),
    email: z.string()
        .email("Invalid email format")
        .min(1, "email is required")
        .max(255, "email must be less than 255 characters")
        .optional(),
    name: z.string()
        .min(1, "name must be at least 1 character")
        .max(100, "name must be less than 100 characters")
        .optional(),
    roleId: z.number()
        .int("roleId must be an integer")
        .positive("roleId must be a positive number")
        .optional(),
    password: z.string()
        .min(6, "password must be at least 6 characters")
        .max(255, "password must be less than 255 characters")
        .optional(),
});

type UpdateStaffRequestType = z.infer<typeof UpdateStaffRequestSchema>;

export class UpdateStaffRequestDto implements UpdateStaffRequestType {
    id: number = 0;
    email?: string;
    name?: string;
    roleId?: number;
    password?: string;

    constructor(data: Partial<UpdateStaffRequestDto> = {}) {
        Object.assign(this, data);
    }

    validate(): UpdateStaffRequestDto {
        const result = UpdateStaffRequestSchema.safeParse(this);
        if (!result.success) {
            throw result.error;
        }
        return result.data as UpdateStaffRequestDto;
    }
}

export class UpdateStaffResponseDto {
    id!: number;
    email!: string;
    name?: string;
    roleId?: number;
    createdAt!: Date;
    updatedAt!: Date;

    constructor(data: Partial<UpdateStaffResponseDto> = {}) {
        Object.assign(this, data);
    }
}

/*************************************************************
 *                       Delete Staff
 ************************************************************/
const DeleteStaffRequestSchema = z.object({
    id: z.number({ message: "id is required" })
        .int("id must be an integer")
        .positive("id must be a positive number")
});

type DeleteStaffRequestType = z.infer<typeof DeleteStaffRequestSchema>;

export class DeleteStaffRequestDto implements DeleteStaffRequestType {
    id: number = 0;
    constructor(data: Partial<DeleteStaffRequestDto> = {}) {
        Object.assign(this, data);
    }
    validate(): DeleteStaffRequestDto {
        const result = DeleteStaffRequestSchema.safeParse(this);
        if (!result.success) {
            throw result.error;
        }
        return result.data as DeleteStaffRequestDto;
    }
}

export class DeleteStaffResponseDto {
    success!: boolean;
    message!: string;

    constructor(data: Partial<DeleteStaffResponseDto> = { success: true, message: "Staff deleted successfully" }) {
        Object.assign(this, data);
    }
}

/*************************************************************
 *                       Staff Login
 ************************************************************/
const StaffLoginRequestSchema = z.object({
    email: z.string({ message: "email is required" })
        .email("Invalid email format")
        .min(1, "email is required")
        .max(255, "email must be less than 255 characters"),
    password: z.string({ message: "password is required" })
        .min(6, "password must be at least 6 characters")
        .max(255, "password must be less than 255 characters"),
});

type StaffLoginRequestType = z.infer<typeof StaffLoginRequestSchema>;

export class StaffLoginRequestDto implements StaffLoginRequestType {
    email: string = '';
    password: string = '';
    constructor(data: Partial<StaffLoginRequestDto> = {}) {
        Object.assign(this, data);
    }
    validate(): StaffLoginRequestDto {
        const result = StaffLoginRequestSchema.safeParse(this);
        if (!result.success) {
            throw result.error;
        }
        return result.data as StaffLoginRequestDto;
    }
}

export class StaffLoginResponseDto {
    token!: string;

    constructor(data: Partial<StaffLoginResponseDto> = {}) {
        Object.assign(this, data);
    }
}

/*************************************************************
 *                   Staff Change Password
 * **********************************************************/
const StaffChangePasswordRequestSchema = z.object({
    id: z.number({ message: "id is required" })
        .int("id must be an integer")
        .positive("id must be a positive number"),
    oldPassword: z.string({ message: "oldPassword is required" })
        .min(6, "oldPassword must be at least 6 characters")
        .max(255, "oldPassword must be less than 255 characters"),
    newPassword: z.string({ message: "newPassword is required" })
        .min(6, "newPassword must be at least 6 characters")
        .max(255, "newPassword must be less than 255 characters"),
});

type StaffChangePasswordRequestType = z.infer<typeof StaffChangePasswordRequestSchema>;

export class StaffChangePasswordRequestDto implements StaffChangePasswordRequestType {
    id: number = 0;
    oldPassword: string = '';
    newPassword: string = '';

    constructor(data: Partial<StaffChangePasswordRequestDto> = {}) {
        Object.assign(this, data);
    }

    validate(): StaffChangePasswordRequestDto {
        const result = StaffChangePasswordRequestSchema.safeParse(this);
        if (!result.success) {
            throw result.error;
        }
        return result.data as StaffChangePasswordRequestDto;
    }
}

export class StaffChangePasswordResponseDto {
    id!: number;
    email!: string;
    name?: string;
    createdAt!: Date;
    updatedAt!: Date;

    constructor(data: Partial<StaffChangePasswordResponseDto> = {}) {
        Object.assign(this, data);
    }
}