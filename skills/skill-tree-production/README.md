# skill-tree-production

This skill includes a reference index generator driven by frontmatter on collection-level `index.md` files inside the target directory.

## Supported Frontmatter

Add frontmatter to a collection `index.md` to control how generated index files are built for that collection.

If a collection does not have an `index.md`, the generator does not create any index files for that collection.

### `property_indexes`

List of frontmatter property names that should get their own generated property index namespace.

When present, the generator creates:
- a property hub page for each named property
- a generated page for each distinct value under that property
- related property links on generated usage pages for records in that collection

### `display_title`

String naming the frontmatter field to use as the primary link text for records in that collection, or a simple template that references frontmatter fields.

When set, generated indexes and usage pages prefer that configured value before falling back to built-in title logic. Templates support `$field` placeholders and `${field|pad:N}` for zero-padded numeric values.

### `relationships`

List of cross-collection relationship rules to derive inbound references from record frontmatter.

Each relationship entry supports:
- `property`: frontmatter field on records in the current collection
- `target_collection`: collection containing the referenced records
- `type`: stored relationship type label
- `relation_label`: user-facing label shown on generated usage pages

### `generate_usage_pages`

Boolean flag that enables generated `*.index.md` usage pages for records in the current collection when those records have inbound references.

### `usage_context_collection`

String naming another collection to use as the display context for local markdown links from records in the current collection.

When set, the generator will use a same-slug record in that collection as the usage context if one exists. Otherwise it falls back to the source record itself.

## Notes

- Collection config is read only from collection `index.md` files.
- A collection must have an `index.md` to opt into generated index output.
- Generated collection hubs preserve the frontmatter already present on those `index.md` files.
- Unknown or invalid config values are ignored, and the generator reports warnings.
