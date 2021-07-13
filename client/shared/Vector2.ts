export class Vector2 {
    
    public x: number;
    public y: number;

    constructor(x: number, y: number) {
        this.x = x;
        this.y = y;
    }

    sub(vector: Vector2) {
        return new Vector2(this.x - vector.x, this.y - vector.y);
    }
    
    add(vector: Vector2) {
        return new Vector2(this.x + vector.x, this.y + vector.y);
    }

    pmul(vector: Vector2) {
        return new Vector2(this.x * vector.x, this.y * vector.y);
    }
    
    pdiv(vector: Vector2) {
        return new Vector2(this.x / vector.x, this.y / vector.y);
    }
    
    mul(scalar: number) {
        return new Vector2(this.x * scalar, this.y * scalar);
    }
    
    div(scalar: number) {
        return new Vector2(this.x / scalar, this.y / scalar);
    }
    
}
