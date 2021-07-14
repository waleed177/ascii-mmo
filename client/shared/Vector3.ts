export class Vector3 {
    
    public x: number;
    public y: number;
    public z: number;

    constructor(x: number, y: number, z: number) {
        this.x = x;
        this.y = y;
        this.z = z;
    }

    sub(vector: Vector3) {
        return new Vector3(this.x - vector.x, this.y - vector.y, this.z - vector.z);
    }
    
    add(vector: Vector3) {
        return new Vector3(this.x + vector.x, this.y + vector.y, this.z + vector.z);
    }

    pmul(vector: Vector3) {
        return new Vector3(this.x * vector.x, this.y * vector.y, this.z * vector.z);
    }
    
    pdiv(vector: Vector3) {
        return new Vector3(this.x / vector.x, this.y / vector.y, this.z / vector.z);
    }
    
    mul(scalar: number) {
        return new Vector3(this.x * scalar, this.y * scalar, this.z * scalar);
    }
    
    div(scalar: number) {
        return new Vector3(this.x / scalar, this.y / scalar, this.z / scalar);
    }
    
}
