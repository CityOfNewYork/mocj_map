# MOCJ WordPress theme

## Building

`$ npm run build`

## Post Types

Custom post types are defined by the [Custom Post Type
UI](https://wordpress.org/plugins/custom-post-type-ui/) plugin. It allows for
exporting and importing of saved post types, which can make it easier to develop
a custom post type in one environment and migrate it to another.

For version control purposes, this export data is saved in `./post-types.json`.
When post types are added or modified, the JSON should be exported and saved
here ("prettified", so that the diffs are clean).
