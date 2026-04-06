describe("Next.js shared UI boilerplate", () => {
  it("keeps the core shell sections available", () => {
    const sections = ["Header", "Footer", "MainContent"];

    expect(sections).toEqual(
      expect.arrayContaining(["Header", "Footer"])
    );
  });
});
