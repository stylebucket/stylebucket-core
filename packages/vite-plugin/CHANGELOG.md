# @stylebucket/vite-plugin

## 0.1.1

### Patch Changes

- 493fb6f: #### Fix ID Issues

  - Change stylesheet id from using virtual prefix to .compiled.css
  - Change default stylesheet id matching from checking prefix to checking suffix. Some platforms like Nuxt move files around which changes the folder structure.
  - Fix issue with styles being dropped from bundle during production build process with tools like Nuxt. Imports pointing to the source module are resolved directly to the stylesheet Id now, instead of the source module being replaced with an import statement. The source module is completely dropped from the build now, only leaving the .compiled.css file left behind.

## 0.1.0

### Minor Changes

- 8a4b4e9: Initial Release Additions

### Patch Changes

- Updated dependencies [8a4b4e9]
  - @stylebucket/compiler@0.1.0
