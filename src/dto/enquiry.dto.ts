import { z } from 'zod';

/*************************************************************
 *                       Enquiry
 *************************************************************/
export class EnquiryResponseDto {
    id!: number;
    email?: string;
    name?: string;
    phone?: string;
    message!: string;
    createdAt!: Date;
    updatedAt!: Date;

    constructor(data: Partial<EnquiryResponseDto>) {
        Object.assign(this, data);
    }
}

/*************************************************************
 *                       Create Enquiry
 ************************************************************/
export const CreateEnquiryRequestSchema = z.object({
    email: z.string().email({ message: 'email must be a valid email' }).optional(),
    name: z.string().min(1, { message: 'name must not be empty' }).max(255, { message: 'name must be less than 255 characters' }).optional(),
    phone: z.string().min(3, { message: 'phone must be at least 3 characters' }).max(50, { message: 'phone must be less than 50 characters' }).optional(),
    message: z.string({ message: 'message is required' }).min(1, { message: 'message must not be empty' }).max(2000, { message: 'message must be less than 2000 characters' })
});

export class CreateEnquiryRequestDto {
    email?: string;
    name?: string;
    phone?: string;
    message!: string;

    constructor(data: Partial<CreateEnquiryRequestDto>) {
        Object.assign(this, data);
    }

    validate() {
        const result = CreateEnquiryRequestSchema.safeParse(this);
        if (!result.success) {
            throw result.error;
        }
        return result.data as CreateEnquiryRequestDto;
    }
}

export class CreateEnquiryResponseDto extends EnquiryResponseDto { }

/*************************************************************
 *                       Get Enquiry By Id
 ************************************************************/
export const GetEnquiryByIdRequestSchema = z.object({
    id: z.number({ message: 'id is required' }).int({ message: 'id must be an integer' }).positive({ message: 'id must be a positive integer' })
});

export class GetEnquiryByIdRequestDto {
    id!: number;

    constructor(data: Partial<GetEnquiryByIdRequestDto>) {
        Object.assign(this, data);
    }

    validate() {
        const result = GetEnquiryByIdRequestSchema.safeParse(this);
        if (!result.success) {
            throw result.error;
        }
        return result.data as GetEnquiryByIdRequestDto;
    }
}

export class GetEnquiryByIdResponseDto extends EnquiryResponseDto { }

/*************************************************************
 *                       Get All Enquiries
 ************************************************************/
export const GetAllEnquiriesRequestSchema = z.object({
    limit: z.number().int().positive().max(100).optional(),
    offset: z.number().int().min(0).optional(),
    orderBy: z.object({
        field: z.enum(['id', 'email', 'name', 'phone', 'message', 'createdAt', 'updatedAt']).optional(),
        direction: z.enum(['asc', 'desc']).optional()
    }).optional()
});

export class GetAllEnquiriesRequestDto {
    limit?: number;
    offset?: number;
    orderBy?: { field?: 'id' | 'email' | 'name' | 'phone' | 'message' | 'createdAt' | 'updatedAt'; direction?: 'asc' | 'desc' };

    constructor(data: Partial<GetAllEnquiriesRequestDto>) {
        Object.assign(this, data);
    }

    validate() {
        const result = GetAllEnquiriesRequestSchema.safeParse(this);
        if (!result.success) {
            throw result.error;
        }
        return result.data as GetAllEnquiriesRequestDto;
    }
}

export class GetAllEnquiriesResponseDto {
    enquiries!: EnquiryResponseDto[];
    total!: number;

    constructor(data: Partial<GetAllEnquiriesResponseDto>) {
        Object.assign(this, data);
    }
}

/*************************************************************
 *                       Update Enquiry
 ************************************************************/
export const UpdateEnquiryRequestSchema = z.object({
    id: z.number({ message: 'id is required' }).int({ message: 'id must be an integer' }).positive({ message: 'id must be a positive integer' }),
    email: z.string().email({ message: 'email must be a valid email' }).optional(),
    name: z.string().min(1, { message: 'name must not be empty' }).max(255, { message: 'name must be less than 255 characters' }).optional(),
    phone: z.string().min(3, { message: 'phone must be at least 3 characters' }).max(50, { message: 'phone must be less than 50 characters' }).optional(),
    message: z.string().min(1, { message: 'message must not be empty' }).max(2000, { message: 'message must be less than 2000 characters' }).optional()
});

export class UpdateEnquiryRequestDto {
    id!: number;
    email?: string;
    name?: string;
    phone?: string;
    message?: string;

    constructor(data: Partial<UpdateEnquiryRequestDto>) {
        Object.assign(this, data);
    }

    validate() {
        const result = UpdateEnquiryRequestSchema.safeParse(this);
        if (!result.success) {
            throw result.error;
        }
        return result.data as UpdateEnquiryRequestDto;
    }
}

export class UpdateEnquiryResponseDto extends EnquiryResponseDto { }

/*************************************************************
 *                       Delete Enquiry
 ************************************************************/
export const DeleteEnquiryRequestSchema = z.object({
    id: z.number({ message: 'id is required' }).int({ message: 'id must be an integer' }).positive({ message: 'id must be a positive integer' })
});

export class DeleteEnquiryRequestDto {
    id!: number;

    constructor(data: Partial<DeleteEnquiryRequestDto>) {
        Object.assign(this, data);
    }

    validate() {
        const result = DeleteEnquiryRequestSchema.safeParse(this);
        if (!result.success) {
            throw result.error;
        }
        return result.data as DeleteEnquiryRequestDto;
    }
}
export class DeleteEnquiryResponseDto {
    success!: boolean;
    message?: string;

    constructor(data: Partial<DeleteEnquiryResponseDto>) {
        Object.assign(this, data);
    }
}
