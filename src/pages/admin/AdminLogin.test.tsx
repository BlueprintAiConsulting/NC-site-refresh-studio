import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => ({
  signInMock: vi.fn(),
  navigateMock: vi.fn(),
}));

vi.mock("@/contexts/useAuth", () => ({
  useAuth: () => ({ signIn: mocks.signInMock }),
}));

vi.mock("@/lib/admin-auth", () => ({
  isAdminLoginConfigured: () => true,
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
    mocks.signInMock.mockReset();
    mocks.navigateMock.mockReset();
    mocks.signInMock.mockResolvedValue(undefined);
  });

  it("submits credentials and navigates on success", async () => {
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

    fireEvent.click(screen.getByRole("button", { name: /sign in/i }));

    await waitFor(() => {
      expect(mocks.signInMock).toHaveBeenCalled();
    });

    expect(mocks.navigateMock).not.toHaveBeenCalled();
  });
});
