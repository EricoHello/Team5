import React from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Stars } from '@react-three/drei';
import './style.css';

/**
 * This is the home page of the application. It is minimalistic in nature and displays a welcome message and a 
 * brief description of the application. The background is a 3D star field created 
 * using Three.js and React Three Fiber.
 */
const Home = () => {
    return (
        <div className="home-container">
            <Canvas className="canvas-background">
                <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade />
                <ambientLight intensity={0.5} />
                <pointLight position={[10, 10, 10]} />
                <OrbitControls enableZoom={false} />
            </Canvas>

            <div className="overlay">
                <h1 className="mission">Practice Coding with Learn2Code</h1>
                <p className="description">Learn2Code offers interactive quizzes and exercises to improve your coding skills efficiently.</p>
            </div>
        </div>
    );
};

export default Home;