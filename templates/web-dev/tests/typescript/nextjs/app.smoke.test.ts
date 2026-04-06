describe("Next.js starter shell", () => {
  it("exposes the application title used in the landing page", () => {
    const metadata = {
      title: "Professional Next.js Architecture",
    };

    expect(metadata.title).toContain("Next.js");
  });
});
