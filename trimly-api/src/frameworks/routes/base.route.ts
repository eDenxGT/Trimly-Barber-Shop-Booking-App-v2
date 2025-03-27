//* ====== Module Imports ====== *//
import { Router } from "express";

export abstract class BaseRoute {
   public router: Router
   constructor() {
      this.router = Router()
      this.initializeRoutes()
   }

   protected abstract initializeRoutes(): void;
}