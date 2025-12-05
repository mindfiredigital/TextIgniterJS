# Proposed Industry-Standard Folder Structure

## Current Structure

```
packages/core/src/headless/
├── demo.html              # Demo file (should be in examples/)
├── dist/                  # Build output ✅
├── headless-demo.ts       # Unused file (can be removed)
├── node_modules/          # Dependencies ✅
├── package.json           # Package config ✅
├── rollup.config.js       # Build config ✅
├── tsconfig.json          # TypeScript config ✅
└── src/
    ├── headless.ts        # Main entry point ✅
    ├── PieceHeadless.ts   # Model (should be in models/)
    └── TextDocumentHeadless.ts # Model (should be in models/)
```

## Recommended Industry-Standard Structure

```
packages/core/src/headless/
├── src/
│   ├── index.ts           # Main entry point (rename from headless.ts)
│   └── models/
│       ├── Piece.ts       # Piece model (rename from PieceHeadless.ts)
│       └── TextDocument.ts # Document model (rename from TextDocumentHeadless.ts)
├── examples/
│   └── demo.html          # Demo file
├── tests/                 # Unit tests (optional, for future)
│   └── headless.test.ts
├── dist/                  # Build output (gitignored)
├── .gitignore            # Git ignore rules ✅
├── README.md              # Documentation ✅
├── package.json           # Package config ✅
├── tsconfig.json          # TypeScript config ✅
└── rollup.config.js       # Build config ✅
```

## Benefits

1. **Clear Separation**: Models in `models/` folder
2. **Examples Separated**: Demo files in `examples/`
3. **Standard Entry Point**: `index.ts` is the industry standard
4. **Test Ready**: `tests/` folder for future test files
5. **Better Organization**: Follows common npm package structure

## Migration Steps

1. Create `src/models/` directory
2. Move `PieceHeadless.ts` → `src/models/Piece.ts`
3. Move `TextDocumentHeadless.ts` → `src/models/TextDocument.ts`
4. Rename `headless.ts` → `index.ts`
5. Update imports in `index.ts`
6. Create `examples/` directory
7. Move `demo.html` → `examples/demo.html`
8. Update demo.html script path
9. Update `rollup.config.js` input path
10. Update `tsconfig.json` if needed

## Note

The current structure works fine, but the proposed structure is more aligned with industry standards and makes the codebase more maintainable.
