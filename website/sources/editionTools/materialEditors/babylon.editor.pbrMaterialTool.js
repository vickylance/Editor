var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var BABYLON;
(function (BABYLON) {
    var EDITOR;
    (function (EDITOR) {
        var LegacyPBRMaterialTool = (function (_super) {
            __extends(LegacyPBRMaterialTool, _super);
            // Protected members
            /**
            * Constructor
            * @param editionTool: edition tool instance
            */
            function LegacyPBRMaterialTool(editionTool) {
                var _this = _super.call(this, editionTool, "LEGACY-PBR-MATERIAL", "LEGACY-PBR", "Legacy PBR") || this;
                // Public members
                // Private members
                _this._dummyPreset = "";
                // Initialize
                _this.onObjectSupported = function (material) { return material instanceof BABYLON.LegacyPBRMaterial; };
                return _this;
            }
            // Update
            LegacyPBRMaterialTool.prototype.update = function () {
                var _this = this;
                if (!_super.prototype.update.call(this))
                    return false;
                this.material.useLogarithmicDepth = this.material.useLogarithmicDepth || false;
                this.material.linkEmissiveWithAlbedo = this.material.linkEmissiveWithAlbedo || false;
                // Presets
                this._dummyPreset = "None";
                var presets = [
                    this._dummyPreset,
                    "Glass",
                    "Metal",
                    "Plastic",
                    "Wood"
                ];
                this._element.add(this, "_dummyPreset", presets, "Preset :").onChange(function (result) {
                    if (_this["_createPreset" + result]) {
                        _this["_createPreset" + result]();
                        _this.update();
                    }
                });
                // PBR
                var pbrFolder = this._element.addFolder("PBR");
                pbrFolder.add(this.material, "cameraContrast").step(0.01).name("Camera Contrast");
                pbrFolder.add(this.material, "cameraExposure").step(0.01).name("Camera Exposure");
                pbrFolder.add(this.material, "microSurface").min(0).step(0.01).name("Micro Surface");
                pbrFolder.add(this.material, "usePhysicalLightFalloff").name("Use Physical Light Fall Off");
                // Albedo
                var albedoFolder = this._element.addFolder("Albedo");
                this.addColorFolder(this.material.albedoColor, "Albedo Color", true, albedoFolder);
                albedoFolder.add(this.material, "directIntensity").step(0.01).name("Direct Intensity");
                albedoFolder.add(this.material, "useAlphaFromAlbedoTexture").name("Use Alpha From Albedo Texture");
                this.addTextureButton("Albedo Texture", "albedoTexture", albedoFolder);
                // Bump
                var bumpFolder = this._element.addFolder("Bump & Parallax");
                bumpFolder.open();
                bumpFolder.add(this.material, "useParallax").name("Use Parallax");
                bumpFolder.add(this.material, "useParallaxOcclusion").name("Use Parallax Occlusion");
                bumpFolder.add(this.material, "parallaxScaleBias").step(0.001).name("Bias");
                bumpFolder.add(this, "_createNormalMapEditor").name("Create normal map from albedo texture...");
                this.addTextureButton("Bump Texture", "bumpTexture", bumpFolder);
                // Reflectivity
                var reflectivityFolder = this._element.addFolder("Reflectivity");
                this.addColorFolder(this.material.reflectivityColor, "Reflectivity Color", true, reflectivityFolder);
                reflectivityFolder.add(this.material, "specularIntensity").min(0).step(0.01).name("Specular Intensity");
                reflectivityFolder.add(this.material, "useSpecularOverAlpha").name("Use Specular Over Alpha");
                reflectivityFolder.add(this.material, "useMicroSurfaceFromReflectivityMapAlpha").name("Use Micro Surface From Reflectivity Map Alpha");
                this.addTextureButton("Reflectivity Texture", "reflectivityTexture", reflectivityFolder);
                // Reflection
                var reflectionFolder = this._element.addFolder("Reflection");
                this.addColorFolder(this.material.reflectionColor, "Reflection Color", true, reflectionFolder);
                reflectionFolder.add(this.material, "environmentIntensity").step(0.01).name("Environment Intensity");
                this.addTextureButton("Reflection Texture", "reflectionTexture", reflectionFolder, true);
                // Metallic
                var metallicFolder = this._element.addFolder("Metallic");
                this.addTextureButton("Metallic Texture", "metallicTexture", metallicFolder, false);
                metallicFolder.add(this.material, "useRoughnessFromMetallicTextureAlpha").name("Use Roughness From Metallic Texture Alpha");
                metallicFolder.add(this.material, "useRoughnessFromMetallicTextureGreen").name("Use Roughness From Metallic Texture Green");
                // Emissive
                var emissiveFolder = this._element.addFolder("Emissive");
                this.addColorFolder(this.material.emissiveColor, "Emissive Color", true, emissiveFolder);
                emissiveFolder.add(this.material, "emissiveIntensity").step(0.01).name("Emissive Intensity");
                emissiveFolder.add(this.material, "linkEmissiveWithAlbedo").name("Link Emissive With Albedo");
                emissiveFolder.add(this.material, "useEmissiveAsIllumination").name("Use Emissive As Illumination");
                this.addTextureButton("Emissive Texture", "emissiveTexture", emissiveFolder);
                // Ambient
                var ambientFolder = this._element.addFolder("Ambient");
                this.addColorFolder(this.material.ambientColor, "Ambient Color", true, ambientFolder);
                this.addTextureButton("Ambient Texture", "ambientTexture", ambientFolder);
                // Light Map
                var lightMapFolder = this._element.addFolder("Light Map");
                lightMapFolder.add(this.material, "useLightmapAsShadowmap").name("Use Lightmap As Shadowmap");
                this.addTextureButton("Light Map Texture", "lightmapTexture", lightMapFolder);
                // Refraction
                var refractionFolder = this._element.addFolder("Refraction");
                refractionFolder.add(this.material, "indexOfRefraction").name("Index of Refraction");
                this.addTextureButton("Refraction Texture", "refractionTexture", refractionFolder, true);
                // Options
                var optionsFolder = this._element.addFolder("Options");
                optionsFolder.add(this.material, "useLightmapAsShadowmap").name("Use Lightmap As Shadowmap");
                optionsFolder.add(this.material, "useLogarithmicDepth").name("Use Logarithmic Depth");
                // Finish
                return true;
            };
            // Create normal map editor
            LegacyPBRMaterialTool.prototype._createNormalMapEditor = function () {
                var _this = this;
                if (!this.material.albedoTexture || !(this.material.albedoTexture instanceof BABYLON.Texture))
                    return EDITOR.GUI.GUIWindow.CreateAlert("Please provide a diffuse texture first and/or use only basic texture", "Info");
                var editor = new EDITOR.NormalMapEditor(this._editionTool.core, this.material.albedoTexture);
                editor.onApply = function (texture) {
                    _this.material.bumpTexture = texture;
                };
            };
            // Preset for glass
            LegacyPBRMaterialTool.prototype._createPresetGlass = function () {
                this.material.linkRefractionWithTransparency = true;
                this.material.useMicroSurfaceFromReflectivityMapAlpha = false;
                this.material.indexOfRefraction = 0.52;
                this.material.alpha = 0;
                this.material.directIntensity = 0.0;
                this.material.environmentIntensity = 0.5;
                this.material.cameraExposure = 0.5;
                this.material.cameraContrast = 1.7;
                this.material.microSurface = 1;
            };
            // Preset for metal
            LegacyPBRMaterialTool.prototype._createPresetMetal = function () {
                this.material.linkRefractionWithTransparency = false;
                this.material.useMicroSurfaceFromReflectivityMapAlpha = false;
                this.material.directIntensity = 0.3;
                this.material.environmentIntensity = 0.7;
                this.material.cameraExposure = 0.55;
                this.material.cameraContrast = 1.6;
                this.material.microSurface = 0.96;
            };
            // Preset for Plastic
            LegacyPBRMaterialTool.prototype._createPresetPlastic = function () {
                this.material.linkRefractionWithTransparency = false;
                this.material.useMicroSurfaceFromReflectivityMapAlpha = false;
                this.material.directIntensity = 0.6;
                this.material.environmentIntensity = 0.7;
                this.material.cameraExposure = 0.6;
                this.material.cameraContrast = 1.6;
                this.material.microSurface = 0.96;
            };
            // Preset for Wood
            LegacyPBRMaterialTool.prototype._createPresetWood = function () {
                this.material.linkRefractionWithTransparency = false;
                this.material.directIntensity = 1.5;
                this.material.environmentIntensity = 0.5;
                this.material.specularIntensity = 0.3;
                this.material.cameraExposure = 0.9;
                this.material.cameraContrast = 1.6;
                this.material.useMicroSurfaceFromReflectivityMapAlpha = true;
            };
            return LegacyPBRMaterialTool;
        }(EDITOR.AbstractMaterialTool));
        EDITOR.LegacyPBRMaterialTool = LegacyPBRMaterialTool;
    })(EDITOR = BABYLON.EDITOR || (BABYLON.EDITOR = {}));
})(BABYLON || (BABYLON = {}));

//# sourceMappingURL=babylon.editor.pbrMaterialTool.js.map
