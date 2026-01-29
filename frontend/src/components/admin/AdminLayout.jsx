import {
  AppShell,
  Burger,
  Group,
  NavLink,
  Stack,
  Text,
  Title,
  Button,
  Avatar,
  Menu,
  UnstyledButton,
  rem,
  Flex,
  ThemeIcon,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import {
  IconDashboard,
  IconUsers,
  IconChartBar,
  IconSettings,
  IconLogout,
  IconChevronRight,
  IconUser,
  IconSparkles,
} from "@tabler/icons-react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { logoutUser } from "../../store/slices/authSlice";

const AdminLayout = ({ children }) => {
  const [opened, { toggle }] = useDisclosure();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useSelector((state) => state.auth);

  const handleLogout = async () => {
    await dispatch(logoutUser());
    navigate("/login");
  };

  const navLinks = [
    {
      icon: IconDashboard,
      label: "Dashboard",
      path: "/admin/dashboard",
    },
    {
      icon: IconUsers,
      label: "User Management",
      path: "/admin/users",
    },
    {
      icon: IconChartBar,
      label: "Polls",
      path: "/admin/polls",
    },
    {
      icon: IconSettings,
      label: "Settings",
      path: "/admin/settings",
    },
  ];

  return (
    <AppShell
      header={{ height: 60 }}
      navbar={{
        width: 300,
        breakpoint: "sm",
        collapsed: { mobile: !opened },
      }}
      padding="md"
    >
      <AppShell.Header>
        <Group h="100%" px="md" justify="space-between">
          <Group>
            <Burger
              opened={opened}
              onClick={toggle}
              hiddenFrom="sm"
              size="sm"
            />
            <Link to="/admin/dashboard" style={{ textDecoration: "none" }}>
              <Flex align="center" gap="xs">
                <ThemeIcon
                  size="xl"
                  radius="md"
                  variant="gradient"
                  gradient={{ from: "blue", to: "cyan" }}
                >
                  <IconSparkles  size={rem(24)} />
                </ThemeIcon>
                <Text size="lg" fw={800} c="blue">
                  POLLR
                </Text>
              </Flex>
            </Link>
          </Group>

          <Group>
            <Menu shadow="md" width={200}>
              <Menu.Target>
                <UnstyledButton>
                  <Group gap="xs">
                    <Avatar
                      src={user?.photoURL}
                      radius="xl"
                      size="sm"
                      color="blue"
                    >
                      {user?.displayName?.charAt(0)}
                    </Avatar>
                    <div style={{ flex: 1 }}>
                      <Text size="sm" fw={500}>
                        {user?.displayName}
                      </Text>
                      <Text size="xs" c="dimmed">
                        Administrator
                      </Text>
                    </div>
                  </Group>
                </UnstyledButton>
              </Menu.Target>

              <Menu.Dropdown>
                <Menu.Label>Application</Menu.Label>
                <Menu.Item
                  leftSection={
                    <IconUser style={{ width: rem(14), height: rem(14) }} />
                  }
                  onClick={() => navigate("/profile")}
                >
                  My Profile
                </Menu.Item>
                <Menu.Divider />
                <Menu.Item
                  color="red"
                  leftSection={
                    <IconLogout style={{ width: rem(14), height: rem(14) }} />
                  }
                  onClick={handleLogout}
                >
                  Logout
                </Menu.Item>
              </Menu.Dropdown>
            </Menu>
          </Group>
        </Group>
      </AppShell.Header>

      <AppShell.Navbar p="md">
        <Stack gap="xs">
          {navLinks.map((link) => (
            <NavLink
              key={link.path}
              label={link.label}
              leftSection={<link.icon size="1.2rem" stroke={1.5} />}
              rightSection={
                <IconChevronRight
                  size="0.8rem"
                  stroke={1.5}
                  className="mantine-rotate-rtl"
                />
              }
              active={location.pathname === link.path}
              onClick={() => {
                navigate(link.path);
                if (opened) toggle();
              }}
              variant="filled"
              radius="md"
            />
          ))}
        </Stack>
      </AppShell.Navbar>

      <AppShell.Main bg="gray.0">{children}</AppShell.Main>
    </AppShell>
  );
};

export default AdminLayout;
