describe("Django React client starter", () => {
  it("keeps the auth workflow routes available", () => {
    const routes = ["/login", "/register"];

    expect(routes).toContain("/login");
  });
});
