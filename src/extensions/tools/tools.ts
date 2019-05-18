import { Node, Scene, ParticleSystem, FilesInputStore, ParticleSystemSet, Vector3 } from 'babylonjs';
import Extensions from '../extensions';

import AssetsExtension from '../assets/assets';
import CodeExtension from '../behavior/code';
import PostProcessEditorExtension from '../post-process-editor/post-process-editor';
import MaterialEditorExtension from '../material-editor/material-editor';
import PathFinderExtension from '../path-finder';
import PathFinder from '../path-finder/path-finder';

export default class Tools {
    /**
     * Returns a custom material by giving its name
     * @param name the name of the custom material
     */
    public getCustomMaterial (name: string): any {
        const ext = <MaterialEditorExtension> Extensions.Instances['MaterialCreatorExtension'];
        if (!ext)
            return null;

        return ext.instances[name];
    }

    /**
     * Returns a custom script given by its object attached to
     * and the name of the script
     * @param object the object containing the script
     * @param name the name of the script
     */
    public getCustomScript (object: string | Node | ParticleSystem | Scene, name: string): any {
        const ext = <CodeExtension> Extensions.Instances['BehaviorExtension'];
        if (!ext)
            return null;

        // String
        if ((typeof object).toLowerCase() === 'string') {
            return ext.instances[object + name];
        }
        // Scene
        else if (object instanceof Scene) {
            return ext.instances['scene' + name];
        }
        // Particle system
        else if (object instanceof ParticleSystem) {
            return ext.instances[object.id + name];
        }
        // Object.name
        else {
            return ext.instances[object['name'] + name];
        }
    }
    
    /**
     * Returns the constructor of a script which has the given name
     * @param name the name of the script
     */
    public getConstructor (name: string): any {
        const ext = <CodeExtension> Extensions.Instances['BehaviorExtension'];
        if (!ext)
            return null;

        return ext.scriptsConstructors[name];
    }

    /**
     * Returns the post-process by giving its name
     * @param name the name of the post-process
     */
    public getCustomPostProcess (name: string): any {
        const ext = <PostProcessEditorExtension> Extensions.Instances['PostProcessCreatorExtension'];
        if (!ext)
            return null;

        return ext.instances[name];
    }

    /**
     * Returns a file given by its name
     * @param name the name of the file
     */
    public getFileByName (name: string): File {
        return FilesInputStore.FilesToLoad[name];
    }

    /**
     * Returns an object url for the given file
     * @param filename the reachable by the created URL
     * @param oneTimeOnly if the URL should be requested only one time
     */
    public getFileUrl (filename: string, oneTimeOnly: boolean = true): string {
        if (Extensions.RoolUrl && Extensions.RoolUrl !== 'file:')
            return Extensions.RoolUrl + filename;
        
        return URL.createObjectURL(this.getFileByName(filename));
    }

    /**
     * Returns the given path finder according to the given name
     * @param name the name of the path finder
     */
    public getPathFinder (name: string): PathFinder {
        const ext = <PathFinderExtension> Extensions.Instances['PathFinderExtension'];
        if (!ext)
            return null;

        return ext.instances[name];
    }

    /**
     * Instantiates a prefab identified by the given name
     * @param name the name of the prefab to instantiate
     */
    public instantiatePrefab<T extends Node> (name: string): T {
        const ext = <AssetsExtension> Extensions.Instances['AssetsExtension'];
        return ext.instantiatePrefab(name);
    }

    /**
     * Instantiates a particle system set identified by the given name
     * @param name the name of the particle system set to instantiate
     * @param position the position where to start systems
     */
    public instantiateParticleSystemSet (name: string, position?: Vector3): ParticleSystemSet {
        const ext = <AssetsExtension> Extensions.Instances['AssetsExtension'];
        return ext.instantiateParticleSystemsSet(name, position);
    }

    /**
     * Calls the given method with the given parameters on the given object which has scripts providing the given method
     * @param object the object reference where to send the message by calling the given method name
     * @param methodName the method name to call with the given parameters
     * @param params the parameters to send to the script attached to the given object
     */
    public sendMessage (object: Node | ParticleSystem | Scene, methodName: string, ...params: any[]): void {
        const ext = <CodeExtension> Extensions.Instances['BehaviorExtension'];
        if (!ext)
            return null;

        const scripts = ext.objectsInstances[object instanceof Scene ? 'Scene' : object.id];
        if (!scripts)
            return;

        scripts.forEach(s => s[methodName] && s[methodName].apply(s, params));
    }
}

/**
 * Strings used by dynamic scripts to write "exportScript" instead of "return Script" etc.
 * This makes TypeScript compliant
 */
const exportScriptBodyString = `
    if (!params) {
        returnValue = value;
    } else {
        returnValue = {
            ctor: value
        };

        var keys = Object.keys(params);
        for (var i = 0; i < keys.length; i++) {
            returnValue[keys[i]] = params[keys[i]];
        }
    }
`.replace(/\n/g, '').replace(/\t/g, '').replace(/  /g, '');

const exportScriptReturnString = `
if (returnValue) {return returnValue;}
if (exports) {return exports;}
`.replace(/\n/g, '').replace(/\t/g, '').replace(/  /g, '');

export const exportScriptString = `
function exportScript (value, params) {${exportScriptBodyString}};
${exportScriptReturnString}
`;