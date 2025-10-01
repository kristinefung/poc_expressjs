import express from 'express';
import { Container } from 'typedi';
import { StaffController } from '../controller/staff.controller';
import { EnquiryController } from '../controller/enquiry.controller';

const router = express.Router();

/*************************************************************
 *                      Staff Module
 ************************************************************/
router.post('/staff', (req, res) => Container.get(StaffController).createStaff(req, res));
router.get('/staff/:id', (req, res) => Container.get(StaffController).getStaffById(req, res));
router.get('/staff', (req, res) => Container.get(StaffController).getAllStaffs(req, res));
router.put('/staff/:id', (req, res) => Container.get(StaffController).updateStaffById(req, res));
router.delete('/staff/:id', (req, res) => Container.get(StaffController).deleteStaffById(req, res));
router.post('/staff/login', (req, res) => Container.get(StaffController).staffLogin(req, res));

/*************************************************************
 *                    Enquiry Module
 ************************************************************/
router.post('/enquiry', (req, res) => Container.get(EnquiryController).createEnquiry(req, res));
router.get('/enquiry/:id', (req, res) => Container.get(EnquiryController).getEnquiryById(req, res));
router.get('/enquiry', (req, res) => Container.get(EnquiryController).getAllEnquiries(req, res));
router.put('/enquiry/:id', (req, res) => Container.get(EnquiryController).updateEnquiryById(req, res));
router.delete('/enquiry/:id', (req, res) => Container.get(EnquiryController).deleteEnquiryById(req, res));

/*************************************************************
 *                      Self Module
 ************************************************************/
router.post('/me/staff/change-password', (req, res) => Container.get(StaffController).staffChangePassword(req, res));

export default router;