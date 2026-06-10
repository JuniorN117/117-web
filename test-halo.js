import fs from 'fs';

const buffer = fs.readFileSync('./public/halo-core.glb');
const jsonChunkLength = buffer.readUInt32LE(12);
const jsonBuffer = buffer.slice(20, 20 + jsonChunkLength);
const gltf = JSON.parse(jsonBuffer.toString('utf8'));

console.log('Nodes:', JSON.stringify(gltf.nodes, null, 2));
console.log('Meshes:', JSON.stringify(gltf.meshes, null, 2));
