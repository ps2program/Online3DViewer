OV.Model = class extends OV.ModelObject3D
{
    constructor ()
    {
        super ();
        this.root = new OV.Node ();
        this.materials = [];
        this.meshes = [];
    }

    GetRootNode ()
    {
        return this.root;
    }

    MaterialCount ()
    {
        return this.materials.length;
    }

    MeshCount ()
    {
        return this.meshes.length;
    }

    VertexCount ()
    {
        let count = 0;
        for (let i = 0; i < this.meshes.length; i++) {
            count += this.meshes[i].VertexCount ();
        }
        return count;
    }

    NormalCount ()
    {
        let count = 0;
        for (let i = 0; i < this.meshes.length; i++) {
            count += this.meshes[i].NormalCount ();
        }
        return count;
    }

    TextureUVCount ()
    {
        let count = 0;
        for (let i = 0; i < this.meshes.length; i++) {
            count += this.meshes[i].TextureUVCount ();
        }
        return count;
    }

    TriangleCount ()
    {
        let count = 0;
        for (let i = 0; i < this.meshes.length; i++) {
            count += this.meshes[i].TriangleCount ();
        }
        return count;
    }

    AddMaterial (material)
    {
        this.materials.push (material);
        return this.materials.length - 1;
    }

    GetMaterial (index)
    {
        return this.materials[index];
    }

    AddMesh (mesh)
    {
        this.meshes.push (mesh);
        return this.meshes.length - 1;
    }

    AddMeshToRootNode (mesh)
    {
        const meshIndex = this.AddMesh (mesh);
        this.root.AddMeshIndex (meshIndex);
        return meshIndex;
    }

    AddMeshToIndex (mesh, index)
    {
        this.meshes.splice (index, 0, mesh);
        this.root.Enumerate ((node) => {
            for (let i = 0; i < node.meshIndices.length; i++) {
                if (node.meshIndices[i] >= index) {
                    node.meshIndices[i] += 1;
                }
            }
        });
        return index;
    }

    RemoveMesh (index)
    {
        this.meshes.splice (index, 1);
        this.root.Enumerate ((node) => {
            for (let i = 0; i < node.meshIndices.length; i++) {
                if (node.meshIndices[i] === index) {
                    node.meshIndices.splice (i, 1);
                    i -= 1;
                } else if (node.meshIndices[i] > index) {
                    node.meshIndices[i] -= 1;
                }
            }
        });
    }

    GetMesh (index)
    {
        return this.meshes[index];
    }

    GetMeshInstance (instanceId)
    {
        let foundNode = null;
        this.root.Enumerate ((node) => {
            if (node.GetId () === instanceId.nodeId) {
                foundNode = node;
            }
        });
        if (foundNode === null) {
            return null;
        }
        // TODO: check it when every model is hierarchical
        // const nodeMeshIndices = foundNode.GetMeshIndices ();
        // if (nodeMeshIndices.indexOf (instanceId.meshIndex) === -1) {
        //     return null;
        // }
        let foundMesh = this.GetMesh (instanceId.meshIndex);
        return new OV.MeshInstance (foundNode, foundMesh);
    }

    EnumerateMeshes (onMesh)
    {
        for (const mesh of this.meshes) {
            onMesh (mesh);
        }
    }

    EnumerateMeshInstances (onMeshInstance)
    {
        this.root.Enumerate ((node) => {
            for (let meshIndex of node.GetMeshIndices ()) {
                let mesh = this.GetMesh (meshIndex);
                let meshInstance = new OV.MeshInstance (node, mesh);
                onMeshInstance (meshInstance);
            }
        });
    }

    EnumerateTransformedMeshInstances (onMesh)
    {
        this.EnumerateMeshInstances ((meshInstance) => {
            const transformed = meshInstance.GetTransformedMesh ();
            onMesh (transformed);
        });
    }

    EnumerateVertices (onVertex)
    {
        for (const mesh of this.meshes) {
            mesh.EnumerateVertices (onVertex);
        }
    }

    EnumerateTriangleVertexIndices (onTriangleVertexIndices)
    {
        for (const mesh of this.meshes) {
            mesh.EnumerateTriangleVertexIndices (onTriangleVertexIndices);
        }
    }

    EnumerateTriangleVertices (onTriangleVertices)
    {
        for (const mesh of this.meshes) {
            mesh.EnumerateTriangleVertices (onTriangleVertices);
        }
    }
};
