import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => ({
  signInMock: vi.fn(),
  navigateMock: vi.fn(),
  setSessionMock: vi.fn(),
  verifyOtpMock: vi.fn(),
  updateUserMock: vi.fn(),
}));

vi.mock("@/contexts/useAuth", () => ({
  useAuth: () => ({ signIn: mocks.signInMock }),
}));

vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual<typeof import("react-router-dom")>("react-router-dom");
  return {
    ...actual,
    useNavigate: () => mocks.navigateMock,
  };
});

vi.mock("@/integrations/supabase/client", () => ({
  supabase: {
    auth: {
      setSession: mocks.setSessionMock,
      verifyOtp: mocks.verifyOtpMock,
      updateUser: mocks.updateUserMock,
    },
  },
}));

describe("AdminLogin invite links", () => {
  beforeEach(() => {
    mocks.signInMock.mockReset();
    mocks.navigateMock.mockReset();
    mocks.setSessionMock.mockReset();
    mocks.verifyOtpMock.mockReset();
    mocks.updateUserMock.mockReset();

    mocks.setSessionMock.mockResolvedValue({ error: null });
    mocks.verifyOtpMock.mockResolvedValue({ error: null });
    mocks.updateUserMock.mockResolvedValue({ error: null });

    window.history.replaceState({}, "", "/admin/login");
  });

  it("reads invite access tokens from URL hash and enables signup flow", async () => {
    window.history.replaceState(
      {},
      "",
      "/admin/login#access_token=abc123&refresh_token=def456&type=invite",
    );

    const { default: AdminLogin } = await import("./AdminLogin");
    render(<AdminLogin />);

    fireEvent.click(screen.getByRole("button", { name: /create your account/i }));

    await waitFor(() => {
      expect(mocks.setSessionMock).toHaveBeenCalledWith({
        access_token: "abc123",
        refresh_token: "def456",
      });
    });

    await waitFor(() => {
      expect(screen.getByRole("button", { name: /create account/i })).toBeEnabled();
    });
  });

  it("reads token_hash from URL hash and verifies invite otp", async () => {
    window.history.replaceState({}, "", "/admin/login#type=invite&token_hash=otp-token");

    const { default: AdminLogin } = await import("./AdminLogin");
    render(<AdminLogin />);

    fireEvent.click(screen.getByRole("button", { name: /create your account/i }));

    await waitFor(() => {
      expect(mocks.verifyOtpMock).toHaveBeenCalledWith({
        type: "invite",
        token_hash: "otp-token",
      });
    });

    await waitFor(() => {
      expect(screen.getByRole("button", { name: /create account/i })).toBeEnabled();
    });
  });
});
