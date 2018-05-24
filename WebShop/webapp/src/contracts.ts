export namespace Contracts {
    export interface CategoryDto {
        readonly id: number;
        readonly name: string;
    }
    export interface EditCategoryDto {
        readonly id: number | null;
        readonly name: string;
    }
    export interface EditProductDto {
        readonly id: number | null;
        readonly name: string;
    }
    export interface IdDto {
        readonly id: number;
    }
    export interface LoginDto {
        readonly username: string;
        readonly password: string;
    }
    export interface ProductDto {
        readonly id: number;
        readonly name: string;
        readonly categories?: ReadonlyArray<Contracts.CategoryDto>;
    }
    export interface SaveDto {
        readonly id: number;
    }
    export interface SuccessDto {
        readonly success: boolean;
    }
}
export type ApiMap = {
    "Controllers.AccountController.Login": {
        query: Contracts.LoginDto,
        result: Contracts.SuccessDto
    },
    "Controllers.AccountController.Create": {
        query: Contracts.LoginDto,
        result: Contracts.SuccessDto
    },
    "Controllers.AccountController.Logout": {
        query: null,
        result: Contracts.SuccessDto
    },
    "Controllers.AccountController.IsLoggedIn": {
        query: null,
        result: Contracts.SuccessDto
    },
    "Controllers.CategoryController.GetAll": {
        query: null,
        result: ReadonlyArray<Contracts.CategoryDto>
    },
    "Controllers.CategoryController.Save": {
        query: Contracts.EditCategoryDto,
        result: Contracts.SaveDto
    },
    "Controllers.CategoryController.Delete": {
        query: Contracts.IdDto,
        result: Contracts.SuccessDto
    },
    "Controllers.ProductController.GetAll": {
        query: null,
        result: ReadonlyArray<Contracts.ProductDto>
    },
    "Controllers.ProductController.Save": {
        query: Contracts.EditProductDto,
        result: Contracts.SaveDto
    },
    "Controllers.ProductController.Delete": {
        query: Contracts.IdDto,
        result: Contracts.SuccessDto
    },
}