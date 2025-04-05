export class ProductDTO {
    constructor(data) {
        if (!data.name || typeof data.name !== 'string') {
            throw new Error('Name is required and must be a string');
        }
        this.name = data.name;
    }
}