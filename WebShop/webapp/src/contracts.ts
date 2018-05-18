export namespace Contracts {
    export interface CategoryDto {
        readonly id: number;
        readonly name: string;
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
    "Controllers.ProductsController.GetAll": {
        query: null,
        result: ReadonlyArray<Contracts.ProductDto>
    },
    "Controllers.ProductsController.GetAllCategories": {
        query: null,
        result: ReadonlyArray<Contracts.CategoryDto>
    },
}