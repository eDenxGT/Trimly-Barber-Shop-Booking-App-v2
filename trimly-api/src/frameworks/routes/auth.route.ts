//* ====== Module Imports ====== *//
import { Request, Response } from "express";

//* ====== BaseRoute Import ====== *//
import { BaseRoute } from "./base.route.js";

//* ====== Controller Imports ====== *//
import { authController } from "../di/resolver.js";

export class AuthRoutes extends BaseRoute {
  constructor() {
    super();
  }
  protected initializeRoutes(): void {
    //* ─────────────────────────────────────────────────────────────
    //*                🛠️ Authentication Endpoints
    //* ─────────────────────────────────────────────────────────────
    this.router.post("/signup", (req: Request, res: Response) => {
      authController.register(req, res);
    });

    this.router.post("/signin", (req: Request, res: Response) => {
      authController.login(req, res);
    });

    this.router.post("/google-auth", (req: Request, res: Response) => {
      authController.authenticateWithGoogle(req, res);
    });

    //* ─────────────────────────────────────────────────────────────
    //*                      🛠️ OTP Endpoints
    //* ─────────────────────────────────────────────────────────────
    this.router.post("/send-otp", (req: Request, res: Response) => {
      authController.sendOtpEmail(req, res);
    });

    this.router.post("/verify-otp", (req: Request, res: Response) => {
      authController.verifyOtp(req, res);
    });

    //* ─────────────────────────────────────────────────────────────
    //*                   🛠️ Password Endpoints
    //* ─────────────────────────────────────────────────────────────
    this.router.post("/forgot-password", (req: Request, res: Response) => {
      authController.forgotPassword(req, res);
    });

    this.router.post("/reset-password", (req: Request, res: Response) => {
      authController.resetPassword(req, res);
    });
  }
}
