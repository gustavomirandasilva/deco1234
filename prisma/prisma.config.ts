// prisma.config.ts

// ... outras importações ...

export default defineConfig({
  datasource: {
    url: process.env["DATABASE_URL"],
    // REMOVA A LINHA ABAIXO:
    // directUrl: process.env["DIRECT_URL"], 
  },
});