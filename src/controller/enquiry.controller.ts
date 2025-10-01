import { Request, Response } from 'express';
import { Service, Inject } from 'typedi';
import { randomUUID } from 'crypto';
import { jsonResponse } from '@/utils/jsonResponse';
import { EnquiryService } from '../service/enquiry.service';
import {
    CreateEnquiryRequestDto,
    GetEnquiryByIdRequestDto,
    GetAllEnquiriesRequestDto,
    UpdateEnquiryRequestDto,
    DeleteEnquiryRequestDto
} from '../dto/enquiry.dto';
import { StaffRole } from '@/utils/enum';
import { AuthService } from '@/service/auth.service';

export interface IEnquiryController {
    createEnquiry(req: Request, res: Response): Promise<void>;
    getEnquiryById(req: Request, res: Response): Promise<void>;
    getAllEnquiries(req: Request, res: Response): Promise<void>;
    updateEnquiryById(req: Request, res: Response): Promise<void>;
    deleteEnquiryById(req: Request, res: Response): Promise<void>;
}

@Service()
export class EnquiryController implements IEnquiryController {
    @Inject(() => EnquiryService)
    private enquiryService!: EnquiryService;

    @Inject(() => AuthService)
    private authServ!: AuthService;

    async createEnquiry(req: Request, res: Response): Promise<void> {
        const traceId = randomUUID();
        try {
            // Step 1: Convert Request to local type
            const dto = new CreateEnquiryRequestDto(req.body);

            // Step 2: Call service
            const result = await this.enquiryService.createEnquiry(dto);

            return jsonResponse(req, res, traceId, result, null);
        } catch (err) {
            return jsonResponse(req, res, traceId, {}, err);
        }
    }

    async getEnquiryById(req: Request, res: Response): Promise<void> {
        const traceId = randomUUID();
        try {
            // Step 0: Validate admin permissions
            const actionUserId = await this.authServ.authUser([StaffRole.ADMIN, StaffRole.VIEWER], req.headers.authorization);

            // Step 1: Convert Request to local type    
            const id = parseInt(req.params.id);
            const dto = new GetEnquiryByIdRequestDto({ id });

            // Step 2: Call service
            const result = await this.enquiryService.getEnquiryById(dto);

            return jsonResponse(req, res, traceId, result, null);
        } catch (err) {
            return jsonResponse(req, res, traceId, {}, err);
        }
    }

    async getAllEnquiries(req: Request, res: Response): Promise<void> {
        const traceId = randomUUID();
        try {
            // Step 0: Validate admin permissions
            const actionUserId = await this.authServ.authUser([StaffRole.ADMIN, StaffRole.VIEWER], req.headers.authorization);

            // Step 1: Convert Request to local type
            const limit = req.query.limit ? parseInt(req.query.limit as string) : undefined;
            const offset = req.query.offset ? parseInt(req.query.offset as string) : undefined;
            const orderBy = req.query.orderBy ? {
                field: req.query.orderBy as 'id' | 'email' | 'name' | 'phone' | 'message' | 'createdAt' | 'updatedAt',
                direction: (req.query.orderDirection as 'asc' | 'desc') || 'desc'
            } : undefined;

            const dto = new GetAllEnquiriesRequestDto({ limit, offset, orderBy });

            // Step 2: Call service
            const result = await this.enquiryService.getAllEnquiries(dto);

            return jsonResponse(req, res, traceId, result, null);
        } catch (err) {
            return jsonResponse(req, res, traceId, {}, err);
        }
    }

    async updateEnquiryById(req: Request, res: Response): Promise<void> {
        const traceId = randomUUID();
        try {
            // Step 0: Validate admin permissions
            const actionUserId = await this.authServ.authUser([StaffRole.ADMIN, StaffRole.VIEWER], req.headers.authorization);

            // Step 1: Convert Request to local type
            const id = parseInt(req.params.id);
            const dto = new UpdateEnquiryRequestDto({ ...req.body, id });

            // Step 2: Call service
            const result = await this.enquiryService.updateEnquiryById(dto);

            return jsonResponse(req, res, traceId, result, null);
        } catch (err) {
            return jsonResponse(req, res, traceId, {}, err);
        }
    }

    async deleteEnquiryById(req: Request, res: Response): Promise<void> {
        const traceId = randomUUID();
        try {
            // Step 0: Validate admin permissions
            const actionUserId = await this.authServ.authUser([StaffRole.ADMIN, StaffRole.VIEWER], req.headers.authorization);

            // Step 1: Convert Request to local type
            const id = parseInt(req.params.id);
            const dto = new DeleteEnquiryRequestDto({ id });

            // Step 2: Call service
            const result = await this.enquiryService.deleteEnquiryById(dto);

            return jsonResponse(req, res, traceId, result, null);
        } catch (err) {
            return jsonResponse(req, res, traceId, {}, err);
        }
    }
}
