export default function SketchAw3(p) {
    const nb = 140;
    const step = 12;
    const DIST = 20;
    const DISTORTION = 15;
    let parts = Array(nb).fill().map(() => Array(nb));
    let mode = false;
    let a = 0;

    p.setup = () => {
        p.createCanvas(window.innerWidth, window.innerHeight);
        let dx = (p.width - nb * step) / 2;
        for (let i = 0; i < nb; i++) {
            for (let j = 0; j < nb; j++) {
                parts[i][j] = new Part(i * step + dx, j * step + dx);
            }
        }
    }

    p.draw = () => {
        p.background(0);
        let m = p.createVector(p.mouseX, p.mouseY);
        for (let i = 0; i < nb; i++) {
            for (let j = 0; j < nb; j++) {
                p.stroke(200 + p.cos(p.radians(i + a * 5)) * 55 / 2, 155 + p.sin(p.radians(j + a * 3)) * 50, 255 / 2 + p.sin(p.radians(a)) * 255 / 2);
                parts[i][j].update(m);
            }
        }
        a++;
    }

    class Part {
        constructor(x, y) {
            this.pos = p.createVector(x, y);
            this.origin = this.pos.copy();
            this.speed = p.createVector(0, 0);
        }
        update(m) {
            let tmp = this.origin.copy();
            tmp.sub(m);
            let d = tmp.mag();
            let c = p.map(d, 0, DIST, 0, p.PI);
            tmp.normalize();

            if (d < DIST) {
                p.strokeWeight(1 + 10 * p.abs(p.cos(c / 2)));
                if (!mode) {
                    tmp.mult(DISTORTION * p.sin(c));
                }
            } else {
                // p.strokeWeight(p.map(p.min(d, p.width), 0, p.width, 5, 0.1));
                p.strokeWeight(12);
            }

            let target = p.createVector(this.origin.x + tmp.x, this.origin.y + tmp.y);
            tmp = this.pos.copy();
            tmp.sub(target);
            tmp.mult(-p.map(m.dist(this.pos), 0, 2 * p.width, 0.1, 0.01));
            this.speed.add(tmp);
            this.speed.mult(.87);
            this.pos.add(this.speed);

            p.point(this.pos.x, this.pos.y);
        }
    }

}