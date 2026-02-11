import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => ({
  signInMock: vi.fn(),
  navigateMock: vi.fn(),
  isAdminLoginConfiguredMock: vi.fn(),
  addLocalAdminAccountMock: vi.fn(),
}));

vi.mock("@/contexts/useAuth", () => ({
  useAuth: () => ({ signIn: mocks.signInMock }),
}));

vi.mock("@/lib/admin-auth", () => ({
  isAdminLoginConfigured: mocks.isAdminLoginConfiguredMock,
  addLocalAdminAccount: mocks.addLocalAdminAccountMock,
}));

vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual<typeof import("react-router-dom")>("react-router-dom");
  return {
    ...actual,
    useNavigate: () => mocks.navigateMock,
  };
});

describe("AdminLogin", () => {
  beforeEach(() => {
    vi.stubEnv("VITE_ADMIN_EMAIL", "admin@example.com");
    vi.stubEnv("VITE_ADMIN_PASSWORD", "StrongPassword123!");
    mocks.signInMock.mockReset();
    mocks.navigateMock.mockReset();
    mocks.isAdminLoginConfiguredMock.mockReset();
    mocks.addLocalAdminAccountMock.mockReset();

    mocks.signInMock.mockResolvedValue(undefined);
    mocks.isAdminLoginConfiguredMock.mockReturnValue(true);
  });

  it("submits credentials and navigates to admin dashboard", async () => {
    const { default: AdminLogin } = await import("./AdminLogin");
    render(<AdminLogin />);

    fireEvent.change(screen.getByLabelText(/email/i), {
      target: { value: "admin@example.com" },
    });
    fireEvent.change(screen.getByLabelText(/password/i), {
      target: { value: "StrongPassword123!" },
    });

    fireEvent.click(screen.getByRole("button", { name: /sign in/i }));

    await waitFor(() => {
      expect(mocks.signInMock).toHaveBeenCalledWith("admin@example.com", "StrongPassword123!");
    });

    await waitFor(() => {
      expect(mocks.navigateMock).toHaveBeenCalledWith("/admin/dashboard");
    });
  });

  it("does not navigate when sign-in fails", async () => {
    mocks.signInMock.mockRejectedValue(new Error("Invalid credentials"));

    const { default: AdminLogin } = await import("./AdminLogin");
    render(<AdminLogin />);

    fireEvent.change(screen.getByLabelText(/email/i), {
      target: { value: "admin@example.com" },
    });
    fireEvent.change(screen.getByLabelText(/password/i), {
      target: { value: "bad-password" },
    });
    fireEvent.change(screen.getByLabelText(/password/i), {
      target: { value: "bad-password" },
    });

    fireEvent.click(screen.getByRole("button", { name: /sign in/i }));

    fireEvent.click(screen.getByRole("button", { name: /sign in/i }));

    await waitFor(() => {
      expect(mocks.signInMock).toHaveBeenCalled();
    });

    expect(mocks.navigateMock).not.toHaveBeenCalled();
  });

  it("creates the first admin account when none exists", async () => {
    mocks.isAdminLoginConfiguredMock.mockReturnValue(false);

    const { default: AdminLogin } = await import("./AdminLogin");
    render(<AdminLogin />);

    fireEvent.change(screen.getByLabelText(/email/i), {
      target: { value: "owner@example.com" },
    });
    fireEvent.change(screen.getByLabelText(/password/i), {
      target: { value: "OwnerPass123!" },
    });

    fireEvent.click(screen.getByRole("button", { name: /create initial admin/i }));

    await waitFor(() => {
      expect(mocks.addLocalAdminAccountMock).toHaveBeenCalledWith("owner@example.com", "OwnerPass123!");
      expect(mocks.signInMock).toHaveBeenCalledWith("owner@example.com", "OwnerPass123!");
    });
  });
});
