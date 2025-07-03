// Network Graph Animation with Connected Nodes
class NetworkGraph {
    constructor() {
        this.canvas = document.getElementById('networkCanvas');
        this.nodes = [];
        this.connections = [];
        this.animationId = null;
        this.time = 0;
        
        this.initializeNodes();
        this.createConnections();
        this.animate();
    }
    
    initializeNodes() {
        // Define nodes with varied movement patterns covering more screen space
        this.nodes = [
            // Large central hub nodes with complex paths
            { id: 'node1', startX: 5, startY: 10, pathX: 95, pathY: 90, size: 6, speed: 0.8, color: 'rgba(220, 220, 220, 0.9)', pattern: 'diagonal' },
            { id: 'node2', startX: 95, startY: 90, pathX: 5, pathY: 10, size: 5, speed: 1.2, color: 'rgba(200, 200, 200, 0.8)', pattern: 'diagonal' },
            
            // Corner-to-corner movement
            { id: 'node3', startX: 2, startY: 2, pathX: 98, pathY: 98, size: 4, speed: 0.9, color: 'rgba(190, 190, 190, 0.7)', pattern: 'corner' },
            { id: 'node4', startX: 98, startY: 2, pathX: 2, pathY: 98, size: 4, speed: 1.1, color: 'rgba(210, 210, 210, 0.8)', pattern: 'corner' },
            
            // Horizontal sweepers
            { id: 'node5', startX: 8, startY: 30, pathX: 92, pathY: 70, size: 3, speed: 0.7, color: 'rgba(180, 180, 180, 0.6)', pattern: 'horizontal' },
            { id: 'node6', startX: 92, startY: 45, pathX: 8, pathY: 55, size: 3, speed: 1.3, color: 'rgba(170, 170, 170, 0.7)', pattern: 'horizontal' },
            
            // Vertical sweepers
            { id: 'node7', startX: 25, startY: 5, pathX: 75, pathY: 95, size: 2, speed: 0.6, color: 'rgba(160, 160, 160, 0.6)', pattern: 'vertical' },
            { id: 'node8', startX: 60, startY: 95, pathX: 40, pathY: 5, size: 2, speed: 1.0, color: 'rgba(150, 150, 150, 0.5)', pattern: 'vertical' },
            
            // Edge wanderers
            { id: 'node9', startX: 1, startY: 60, pathX: 99, pathY: 40, size: 2, speed: 1.4, color: 'rgba(140, 140, 140, 0.4)', pattern: 'edge' },
            { id: 'node10', startX: 99, startY: 15, pathX: 1, pathY: 85, size: 1, speed: 0.5, color: 'rgba(130, 130, 130, 0.4)', pattern: 'edge' },
            { id: 'node11', startX: 15, startY: 99, pathX: 85, pathY: 1, size: 1, speed: 1.5, color: 'rgba(120, 120, 120, 0.3)', pattern: 'edge' },
            
            // Circular orbit nodes
            { id: 'node12', startX: 50, startY: 20, pathX: 80, pathY: 50, size: 2, speed: 0.9, color: 'rgba(200, 200, 200, 0.5)', pattern: 'orbit' },
            { id: 'node13', startX: 80, startY: 80, pathX: 20, pathY: 20, size: 1, speed: 1.1, color: 'rgba(190, 190, 190, 0.4)', pattern: 'orbit' },
            
            // Random wanderers covering full space
            { id: 'node14', startX: 12, startY: 35, pathX: 88, pathY: 65, size: 1, speed: 1.6, color: 'rgba(180, 180, 180, 0.3)', pattern: 'random' },
            { id: 'node15', startX: 88, startY: 25, pathX: 12, pathY: 75, size: 1, speed: 0.4, color: 'rgba(170, 170, 170, 0.3)', pattern: 'random' },
            { id: 'node16', startX: 45, startY: 8, pathX: 55, pathY: 92, size: 1, speed: 1.8, color: 'rgba(160, 160, 160, 0.3)', pattern: 'random' },
            { id: 'node17', startX: 78, startY: 12, pathX: 22, pathY: 88, size: 1, speed: 0.6, color: 'rgba(150, 150, 150, 0.3)', pattern: 'random' },
            
            // Additional coverage nodes
            { id: 'node18', startX: 33, startY: 7, pathX: 67, pathY: 93, size: 2, speed: 1.0, color: 'rgba(200, 200, 200, 0.4)', pattern: 'vertical' },
            { id: 'node19', startX: 7, startY: 50, pathX: 93, pathY: 50, size: 2, speed: 0.8, color: 'rgba(190, 190, 190, 0.4)', pattern: 'horizontal' },
            { id: 'node20', startX: 55, startY: 3, pathX: 45, pathY: 97, size: 1, speed: 1.3, color: 'rgba(180, 180, 180, 0.3)', pattern: 'vertical' },
            { id: 'node21', startX: 3, startY: 25, pathX: 97, pathY: 75, size: 1, speed: 0.9, color: 'rgba(170, 170, 170, 0.3)', pattern: 'diagonal' },
            
            // Corner specialists
            { id: 'node22', startX: 3, startY: 97, pathX: 97, pathY: 3, size: 2, speed: 1.1, color: 'rgba(160, 160, 160, 0.4)', pattern: 'corner' },
            { id: 'node23', startX: 97, startY: 97, pathX: 3, pathY: 3, size: 1, speed: 0.7, color: 'rgba(150, 150, 150, 0.3)', pattern: 'corner' },
            
            // More orbital nodes
            { id: 'node24', startX: 30, startY: 30, pathX: 70, pathY: 70, size: 1, speed: 1.4, color: 'rgba(140, 140, 140, 0.3)', pattern: 'orbit' },
            { id: 'node25', startX: 70, startY: 30, pathX: 30, pathY: 70, size: 1, speed: 0.6, color: 'rgba(130, 130, 130, 0.3)', pattern: 'orbit' },
            
            // Edge runners
            { id: 'node26', startX: 2, startY: 40, pathX: 98, pathY: 60, size: 1, speed: 1.7, color: 'rgba(120, 120, 120, 0.3)', pattern: 'edge' },
            { id: 'node27', startX: 40, startY: 2, pathX: 60, pathY: 98, size: 1, speed: 0.5, color: 'rgba(110, 110, 110, 0.3)', pattern: 'edge' },
            { id: 'node28', startX: 98, startY: 60, pathX: 2, pathY: 40, size: 1, speed: 1.2, color: 'rgba(100, 100, 100, 0.3)', pattern: 'edge' },
            
            // Dense center activity
            { id: 'node29', startX: 40, startY: 40, pathX: 60, pathY: 60, size: 2, speed: 0.8, color: 'rgba(210, 210, 210, 0.4)', pattern: 'orbit' },
            { id: 'node30', startX: 35, startY: 65, pathX: 65, pathY: 35, size: 1, speed: 1.5, color: 'rgba(195, 195, 195, 0.3)', pattern: 'random' },
            
            // Sweep patterns
            { id: 'node31', startX: 15, startY: 15, pathX: 85, pathY: 85, size: 1, speed: 0.9, color: 'rgba(185, 185, 185, 0.3)', pattern: 'diagonal' },
            { id: 'node32', startX: 85, startY: 15, pathX: 15, pathY: 85, size: 1, speed: 1.1, color: 'rgba(175, 175, 175, 0.3)', pattern: 'diagonal' },
            
            // More random wanderers for density
            { id: 'node33', startX: 28, startY: 72, pathX: 72, pathY: 28, size: 1, speed: 1.6, color: 'rgba(165, 165, 165, 0.3)', pattern: 'random' },
            { id: 'node34', startX: 58, startY: 18, pathX: 42, pathY: 82, size: 1, speed: 0.7, color: 'rgba(155, 155, 155, 0.3)', pattern: 'random' },
            { id: 'node35', startX: 18, startY: 58, pathX: 82, pathY: 42, size: 1, speed: 1.3, color: 'rgba(145, 145, 145, 0.3)', pattern: 'random' }
        ];
        
        // Calculate current positions
        this.nodes.forEach(node => {
            node.currentX = node.startX;
            node.currentY = node.startY;
        });
    }
    
    createConnections() {
        // Define dynamic connections between nodes of different types
        this.connections = [
            // Hub connections (large nodes to medium/small nodes)
            { from: 'node1', to: 'node2', maxDistance: 65 },
            { from: 'node1', to: 'node3', maxDistance: 50 },
            { from: 'node1', to: 'node5', maxDistance: 45 },
            { from: 'node2', to: 'node4', maxDistance: 55 },
            { from: 'node2', to: 'node6', maxDistance: 40 },
            
            // Cross-pattern connections
            { from: 'node3', to: 'node4', maxDistance: 60 },
            { from: 'node5', to: 'node6', maxDistance: 35 },
            { from: 'node7', to: 'node8', maxDistance: 40 },
            
            // Edge to center connections
            { from: 'node9', to: 'node12', maxDistance: 45 },
            { from: 'node10', to: 'node13', maxDistance: 38 },
            { from: 'node11', to: 'node12', maxDistance: 42 },
            
            // Orbital connections
            { from: 'node12', to: 'node13', maxDistance: 50 },
            { from: 'node12', to: 'node5', maxDistance: 35 },
            { from: 'node13', to: 'node6', maxDistance: 30 },
            
            // Random wanderer interconnections
            { from: 'node14', to: 'node15', maxDistance: 55 },
            { from: 'node15', to: 'node16', maxDistance: 48 },
            { from: 'node16', to: 'node17', maxDistance: 52 },
            { from: 'node14', to: 'node17', maxDistance: 45 },
            
            // Cross-layer connections for complex network
            { from: 'node7', to: 'node14', maxDistance: 35 },
            { from: 'node8', to: 'node15', maxDistance: 40 },
            { from: 'node9', to: 'node16', maxDistance: 38 },
            { from: 'node10', to: 'node17', maxDistance: 42 },
            
            // Hub to edge connections
            { from: 'node1', to: 'node9', maxDistance: 58 },
            { from: 'node2', to: 'node11', maxDistance: 60 },
            { from: 'node3', to: 'node10', maxDistance: 48 },
            { from: 'node4', to: 'node9', maxDistance: 52 },
            
            // Additional coverage node connections
            { from: 'node18', to: 'node19', maxDistance: 50 },
            { from: 'node18', to: 'node7', maxDistance: 40 },
            { from: 'node19', to: 'node6', maxDistance: 35 },
            { from: 'node20', to: 'node21', maxDistance: 45 },
            { from: 'node21', to: 'node1', maxDistance: 55 },
            
            // Corner specialist connections
            { from: 'node22', to: 'node23', maxDistance: 60 },
            { from: 'node22', to: 'node3', maxDistance: 40 },
            { from: 'node23', to: 'node4', maxDistance: 38 },
            
            // Orbital interconnections
            { from: 'node24', to: 'node25', maxDistance: 45 },
            { from: 'node24', to: 'node29', maxDistance: 25 },
            { from: 'node25', to: 'node29', maxDistance: 30 },
            
            // Edge runner network
            { from: 'node26', to: 'node27', maxDistance: 50 },
            { from: 'node27', to: 'node28', maxDistance: 55 },
            { from: 'node26', to: 'node28', maxDistance: 65 },
            
            // Dense center connections
            { from: 'node29', to: 'node30', maxDistance: 25 },
            { from: 'node29', to: 'node5', maxDistance: 30 },
            { from: 'node30', to: 'node12', maxDistance: 35 },
            
            // Diagonal sweep connections
            { from: 'node31', to: 'node32', maxDistance: 70 },
            { from: 'node31', to: 'node1', maxDistance: 45 },
            { from: 'node32', to: 'node2', maxDistance: 50 },
            
            // Random wanderer mesh
            { from: 'node33', to: 'node34', maxDistance: 50 },
            { from: 'node34', to: 'node35', maxDistance: 45 },
            { from: 'node33', to: 'node35', maxDistance: 55 },
            
            // Cross-layer dynamic connections
            { from: 'node18', to: 'node31', maxDistance: 40 },
            { from: 'node19', to: 'node26', maxDistance: 35 },
            { from: 'node20', to: 'node27', maxDistance: 42 },
            { from: 'node21', to: 'node28', maxDistance: 38 },
            { from: 'node22', to: 'node33', maxDistance: 40 },
            { from: 'node23', to: 'node34', maxDistance: 45 },
            { from: 'node24', to: 'node35', maxDistance: 30 },
            { from: 'node25', to: 'node30', maxDistance: 35 }
        ];
    }
    
    updateNodePositions() {
        const baseProgress = (Math.sin(this.time * 0.0001) + 1) / 2;
        
        this.nodes.forEach(node => {
            let nodeProgress = baseProgress * node.speed % 1;
            let x, y;
            
            // Apply different movement patterns based on node type
            switch(node.pattern) {
                case 'diagonal':
                    // Straight diagonal movement with easing
                    const easedProgress = this.easeInOutQuad(nodeProgress);
                    x = node.startX + (node.pathX - node.startX) * easedProgress;
                    y = node.startY + (node.pathY - node.startY) * easedProgress;
                    break;
                    
                case 'corner':
                    // L-shaped movement (corner to corner with bend)
                    const cornerProgress = this.easeInOutCubic(nodeProgress);
                    if (cornerProgress < 0.5) {
                        // First move horizontally
                        x = node.startX + (node.pathX - node.startX) * (cornerProgress * 2);
                        y = node.startY;
                    } else {
                        // Then move vertically
                        x = node.pathX;
                        y = node.startY + (node.pathY - node.startY) * ((cornerProgress - 0.5) * 2);
                    }
                    break;
                    
                case 'orbit':
                    // Circular/elliptical orbit around center point
                    const centerX = (node.startX + node.pathX) / 2;
                    const centerY = (node.startY + node.pathY) / 2;
                    const radiusX = Math.abs(node.pathX - node.startX) / 2;
                    const radiusY = Math.abs(node.pathY - node.startY) / 2;
                    const angle = nodeProgress * Math.PI * 2;
                    x = centerX + Math.cos(angle) * radiusX;
                    y = centerY + Math.sin(angle) * radiusY;
                    break;
                    
                case 'horizontal':
                    // Horizontal sweep with vertical wobble
                    const hProgress = this.easeInOutQuad(nodeProgress);
                    x = node.startX + (node.pathX - node.startX) * hProgress;
                    y = node.startY + (node.pathY - node.startY) * hProgress + Math.sin(nodeProgress * Math.PI * 3) * 3;
                    break;
                    
                case 'vertical':
                    // Vertical sweep with horizontal wobble
                    const vProgress = this.easeInOutQuad(nodeProgress);
                    x = node.startX + (node.pathX - node.startX) * vProgress + Math.sin(nodeProgress * Math.PI * 4) * 2;
                    y = node.startY + (node.pathY - node.startY) * vProgress;
                    break;
                    
                case 'edge':
                    // Follow screen edges with smooth transitions
                    const edgeProgress = this.easeInOutQuad(nodeProgress);
                    x = node.startX + (node.pathX - node.startX) * edgeProgress;
                    y = node.startY + (node.pathY - node.startY) * edgeProgress;
                    // Add edge-hugging behavior
                    if (x < 10) x = Math.max(1, x);
                    if (x > 90) x = Math.min(99, x);
                    if (y < 10) y = Math.max(1, y);
                    if (y > 90) y = Math.min(99, y);
                    break;
                    
                case 'random':
                default:
                    // Complex random-like movement with multiple sine waves
                    const rProgress = nodeProgress;
                    x = node.startX + (node.pathX - node.startX) * rProgress + 
                        Math.sin(rProgress * Math.PI * 2 + this.time * 0.00008) * 5 +
                        Math.cos(rProgress * Math.PI * 3 + this.time * 0.00006) * 2;
                    y = node.startY + (node.pathY - node.startY) * rProgress + 
                        Math.cos(rProgress * Math.PI * 2.5 + this.time * 0.00008) * 4 +
                        Math.sin(rProgress * Math.PI * 1.7 + this.time * 0.0001) * 1.5;
                    break;
            }
            
            // Ensure nodes stay within bounds
            node.currentX = Math.max(1, Math.min(99, x));
            node.currentY = Math.max(1, Math.min(99, y));
            
            // Add subtle global breathing effect
            const breathingOffset = Math.sin(this.time * 0.00005 + node.id.charCodeAt(4)) * 0.5;
            node.currentX += breathingOffset;
            node.currentY += breathingOffset * 0.3;
        });
    }
    
    easeInOutQuad(t) {
        return t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
    }
    
    easeInOutCubic(t) {
        return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
    }
    
    calculateDistance(node1, node2) {
        const dx = node1.currentX - node2.currentX;
        const dy = node1.currentY - node2.currentY;
        return Math.sqrt(dx * dx + dy * dy);
    }
    
    renderGraph() {
        // Clear existing elements
        const existingElements = this.canvas.querySelectorAll('line, circle');
        existingElements.forEach(element => element.remove());
        
        // Render connections first (so they appear behind nodes)
        this.connections.forEach(connection => {
            const fromNode = this.nodes.find(n => n.id === connection.from);
            const toNode = this.nodes.find(n => n.id === connection.to);
            
            if (fromNode && toNode) {
                const distance = this.calculateDistance(fromNode, toNode);
                
                // Only draw line if nodes are within connection distance
                if (distance <= connection.maxDistance) {
                    const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
                    line.setAttribute('x1', fromNode.currentX);
                    line.setAttribute('y1', fromNode.currentY);
                    line.setAttribute('x2', toNode.currentX);
                    line.setAttribute('y2', toNode.currentY);
                    
                    // Calculate opacity based on distance (closer = more opaque)
                    const opacity = Math.max(0.1, 1 - (distance / connection.maxDistance));
                    line.setAttribute('stroke', `rgba(180, 180, 180, ${opacity * 0.4})`);
                    line.setAttribute('stroke-width', '0.08');
                    line.setAttribute('stroke-linecap', 'round');
                    
                    this.canvas.appendChild(line);
                }
            }
        });
        
        // Render nodes on top of connections
        this.nodes.forEach(node => {
            const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
            circle.setAttribute('cx', node.currentX);
            circle.setAttribute('cy', node.currentY);
            circle.setAttribute('r', node.size * 0.15); // Scale size for SVG viewBox
            
            // Dynamic opacity based on node movement and size
            const pulseOpacity = 0.7 + 0.3 * Math.sin(this.time * 0.0005 + node.id.charCodeAt(4));
            const baseOpacity = node.size > 3 ? 0.9 : node.size > 2 ? 0.7 : 0.5;
            
            // Use gradient for larger nodes, solid color for smaller ones
            if (node.size > 3) {
                circle.setAttribute('fill', 'url(#nodeGradient)');
                circle.setAttribute('filter', 'url(#nodeGlow)');
                circle.setAttribute('opacity', baseOpacity * pulseOpacity);
            } else {
                circle.setAttribute('fill', node.color.replace(/[\d\.]+\)$/g, `${baseOpacity * pulseOpacity})`));
            }
            
            circle.setAttribute('stroke', 'rgba(240, 240, 240, 0.4)');
            circle.setAttribute('stroke-width', node.size > 2 ? '0.03' : '0.02');
            
            this.canvas.appendChild(circle);
        });
    }
    
    animate() {
        this.time += 16; // Roughly 60fps
        
        this.updateNodePositions();
        this.renderGraph();
        
        this.animationId = requestAnimationFrame(() => this.animate());
    }
    
    destroy() {
        if (this.animationId) {
            cancelAnimationFrame(this.animationId);
        }
    }
}

// Initialize network graph when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.networkGraph = new NetworkGraph();
});

// Export for global use
window.NetworkGraph = NetworkGraph;