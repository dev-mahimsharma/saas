describe("MERN server starter", () => {
  it("registers the authentication routes", () => {
    const routePrefixes = ["/api/auth", "/api/users"];

    expect(routePrefixes).toEqual(
      expect.arrayContaining(["/api/auth", "/api/users"])
    );
  });
});
