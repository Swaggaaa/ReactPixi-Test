import {AnimatedSprite, Container, useApp, useTick} from "@inlet/react-pixi";
import {useEffect, useRef, useState} from "react";
import {InteractionEvent} from "@pixi/interaction";
import {Texture} from "pixi.js";
import * as PIXI from "pixi.js";

export const Jet = () => {
    const spritesheet =
        "https://pixijs.io/examples/examples/assets/spritesheet/fighter.json";
    const BULLET_SPEED = 10;
    const isDragging = useRef(false);
    const offset = useRef({ x: 0, y: 0 });
    const [position, setPosition] = useState({ x: 300, y: 300 })
    const [alpha, setAlpha] = useState(1);
    const [frames, setFrames] = useState<Texture[]>([]);
    const [bullets, setBullets] = useState<PIXI.Graphics[]>([]);
    const app = useApp();

    useEffect(() => {
        app.loader.add(spritesheet).load((_, resource) => {
            const frames = Object.keys(resource[spritesheet].data.frames);
            setFrames(frames.map((frame) => {
                return Texture.from(frame)
            }));
        });
    }, [app.loader]);

    useEffect(() => {
        const createBullet = () => {
            const bullet = new PIXI.Graphics();
            bullet.beginFill(0xFFFF00);
            bullet.lineStyle(5, 0xFF0000);
            bullet.drawRect(position.x, position.y, 4, 20);
            app.stage.addChild(bullet);
            setBullets([...bullets, bullet]);
        }

        const handler = (event: KeyboardEvent) => {
            if (event.ctrlKey) {
                createBullet();
            }
        }

        window.addEventListener("keydown",  handler);

        return () => {
            window.removeEventListener("keydown", handler);
        }
    }, [app.stage, bullets, position.x, position.y])

    useTick(delta => {
        bullets.forEach((bullet: PIXI.Graphics) => {
            bullet.position.y -= BULLET_SPEED * delta;
        })
    })

    const onStart = (e: InteractionEvent) => {
        isDragging.current = true;
        offset.current = {
            x: e.data.global.x - position.x,
            y: e.data.global.y - position.y
        };

        setAlpha(0.5);
    }

    const onEnd = () => {
        isDragging.current = false;
        setAlpha(1);
    };

    const onMove = (e: InteractionEvent) => {
        if (isDragging.current) {
            setPosition({
                x: e.data.global.x - offset.current.x,
                y: e.data.global.y - offset.current.y,
            })
        }
    };

    if (!frames.length) {
        return null;
    }

    return (
        <Container>
            <AnimatedSprite
            isPlaying={true}
            animationSpeed={0.5}
            textures={frames}
            anchor={0.5}
            alpha={alpha}
            position={position}
            interactive={true}
            pointerdown={onStart}
            pointerup={onEnd}
            pointerupoutside={onEnd}
            pointermove={onMove}
        />
        </Container>
    );
}