import { Request, Response } from 'express';
import { StaffService } from '../service/staff.service';
import { randomUUID } from 'crypto';
import { Service, Inject } from 'typedi';

import {
    CreateStaffRequestDto,
    GetStaffByIdRequestDto,
    GetAllStaffsRequestDto,
    UpdateStaffRequestDto,
    DeleteStaffRequestDto,
    StaffLoginRequestDto,
    StaffChangePasswordRequestDto
} from '../dto/staff.dto';
import { jsonResponse } from '@/utils/jsonResponse';
import { AuthService } from '@/service/auth.service';
import { StaffRole } from '@/utils/enum';

export interface IStaffController {
    createStaff(req: Request, res: Response): Promise<void>;
    getStaffById(req: Request, res: Response): Promise<void>;
    getAllStaffs(req: Request, res: Response): Promise<void>;
    updateStaffById(req: Request, res: Response): Promise<void>;
    deleteStaffById(req: Request, res: Response): Promise<void>;
    staffLogin(req: Request, res: Response): Promise<void>;
    staffChangePassword(req: Request, res: Response): Promise<void>;
}

@Service()
export class StaffController implements IStaffController {
    @Inject(() => StaffService)
    private staffService!: StaffService;

    @Inject(() => AuthService)
    private authServ!: AuthService;

    async createStaff(req: Request, res: Response): Promise<void> {
        const traceId = randomUUID();
        try {
            // Step 0: Validate admin permissions
            const actionUsrId = await this.authServ.authUser([StaffRole.ADMIN], req.headers.authorization);

            // Step 1: Convert Request to local type
            const staffReq = new CreateStaffRequestDto(req.body);

            // Step 2: Call service to handle business logic
            const result = await this.staffService.createStaff(staffReq);

            return jsonResponse(req, res, traceId, result, null);
        } catch (err) {
            return jsonResponse(req, res, traceId, {}, err);
        }
    }

    async getStaffById(req: Request, res: Response): Promise<void> {
        const traceId = randomUUID();
        try {
            // Step 0: Validate admin permissions
            const actionUserId = await this.authServ.authUser([StaffRole.ADMIN], req.headers.authorization);

            // Step 1: Convert Request to local type
            const id = parseInt(req.params.id);
            const staffReq = new GetStaffByIdRequestDto({ id });

            // Step 2: Call service to handle business logic
            const result = await this.staffService.getStaffById(staffReq);

            return jsonResponse(req, res, traceId, result, null);
        } catch (err) {
            return jsonResponse(req, res, traceId, {}, err);
        }
    }

    async getAllStaffs(req: Request, res: Response): Promise<void> {
        const traceId = randomUUID();
        try {
            // Step 0: Validate admin permissions
            const actionUserId = await this.authServ.authUser([StaffRole.ADMIN], req.headers.authorization);

            // Step 1: Convert Request to local type
            const limit = req.query.limit ? parseInt(req.query.limit as string) : undefined;
            const offset = req.query.offset ? parseInt(req.query.offset as string) : undefined;
            const orderBy = req.query.orderBy ? {
                field: req.query.orderBy as 'id' | 'email' | 'name' | 'createdAt' | 'updatedAt',
                direction: (req.query.orderDirection as 'asc' | 'desc') || 'desc'
            } : undefined;

            const staffReq = new GetAllStaffsRequestDto({ limit, offset, orderBy });

            // Step 2: Call service
            const result = await this.staffService.getAllStaffs(staffReq);

            return jsonResponse(req, res, traceId, result, null);
        } catch (err) {
            return jsonResponse(req, res, traceId, {}, err);
        }
    }

    async updateStaffById(req: Request, res: Response): Promise<void> {
        const traceId = randomUUID();
        try {
            // Step 0: Validate admin permissions
            const actionUserId = await this.authServ.authUser([StaffRole.ADMIN], req.headers.authorization);

            // Step 1: Convert Request to local type
            const id = parseInt(req.params.id);
            const staffReq = new UpdateStaffRequestDto({ ...req.body, id });

            // Step 2: Call service
            const result = await this.staffService.updateStaffById(staffReq);

            return jsonResponse(req, res, traceId, result, null);
        } catch (err) {
            return jsonResponse(req, res, traceId, {}, err);
        }
    }

    async deleteStaffById(req: Request, res: Response): Promise<void> {
        const traceId = randomUUID();
        try {
            // Step 0: Validate admin permissions
            const actionUserId = await this.authServ.authUser([StaffRole.ADMIN], req.headers.authorization);

            // Step 1: Convert Request to local type
            const staffId = parseInt(req.params.id);
            const staffReq = new DeleteStaffRequestDto({ id: staffId });

            // Step 2: Call service
            const result = await this.staffService.deleteStaffById(staffReq);

            return jsonResponse(req, res, traceId, result, null);
        } catch (err) {
            return jsonResponse(req, res, traceId, {}, err);
        }
    }

    async staffLogin(req: Request, res: Response): Promise<void> {
        const traceId = randomUUID();
        try {
            // Step 1: Convert Request to local type
            const staffReq = new StaffLoginRequestDto(req.body);

            // Step 2: Call service
            const result = await this.staffService.staffLogin(staffReq);

            return jsonResponse(req, res, traceId, result, null);
        } catch (err) {
            return jsonResponse(req, res, traceId, {}, err);
        }
    }

    async staffChangePassword(req: Request, res: Response): Promise<void> {
        const traceId = randomUUID();
        try {
            // Step 0: Validate admin permissions
            const actionUserId = await this.authServ.authUser([StaffRole.ADMIN, StaffRole.VIEWER], req.headers.authorization);

            // Step 1: Convert Request to local type
            const resetReq = new StaffChangePasswordRequestDto({ id: actionUserId, oldPassword: req.body.oldPassword, newPassword: req.body.newPassword });

            // Step 2: Call service
            const result = await this.staffService.staffChangePassword(resetReq);

            return jsonResponse(req, res, traceId, result, null);
        } catch (err) {
            return jsonResponse(req, res, traceId, {}, err);
        }
    }
} 