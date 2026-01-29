import { useNavigate, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  AppShell,
  Burger,
  Group,
  Text,
  NavLink,
  Avatar,
  Menu,
  UnstyledButton,
  rem,
  Image,
  Flex,
  ThemeIcon,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import {
  IconHome,
  IconUser,
  IconLogout,
  IconChevronDown,
  IconChartBar,
  IconSparkles,
} from "@tabler/icons-react";
import { logoutUser } from "../../store/slices/authSlice";

const UserLayout = ({ children }) => {
  const [opened, { toggle }] = useDisclosure();
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);

  const handleLogout = async () => {
    await dispatch(logoutUser());
    navigate("/login");
  };

  const navItems = [
    { icon: IconHome, label: "Home", path: "/home" },
    { icon: IconChartBar, label: "My Polls", path: "/my-polls" },
    { icon: IconUser, label: "Profile", path: "/profile" },
  ];

  return (
    <AppShell
      header={{ height: 60 }}
      navbar={{
        width: 280,
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
            <Flex align="center" gap="xs">
              <ThemeIcon
                size="xl"
                radius="md"
                variant="gradient"
                gradient={{ from: "blue", to: "cyan" }}
              >
                <IconSparkles size={rem(24)} />
              </ThemeIcon>
              <Text size="lg" fw={800} c="blue">
                POLLR
              </Text>
            </Flex>
          </Group>

          <Menu shadow="md" width={200}>
            <Menu.Target>
              <UnstyledButton>
                <Group gap="xs">
                  <Avatar
                    src={user?.photoURL}
                    alt={user?.displayName}
                    radius="xl"
                    size="sm"
                  />
                  <div style={{ flex: 1 }}>
                    <Text size="sm" fw={500}>
                      {user?.displayName || "User"}
                    </Text>
                  </div>
                  <IconChevronDown size={16} />
                </Group>
              </UnstyledButton>
            </Menu.Target>

            <Menu.Dropdown>
              <Menu.Label>Account</Menu.Label>
              <Menu.Item
                leftSection={<IconUser size={14} />}
                onClick={() => navigate("/profile")}
              >
                Profile
              </Menu.Item>
              <Menu.Divider />
              <Menu.Item
                color="red"
                leftSection={<IconLogout size={14} />}
                onClick={handleLogout}
              >
                Logout
              </Menu.Item>
            </Menu.Dropdown>
          </Menu>
        </Group>
      </AppShell.Header>

      <AppShell.Navbar p="md">
        <AppShell.Section grow>
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              href={item.path}
              label={item.label}
              leftSection={<item.icon size={20} stroke={1.5} />}
              active={location.pathname === item.path}
              onClick={(e) => {
                e.preventDefault();
                navigate(item.path);
                if (opened) toggle();
              }}
              mb="xs"
            />
          ))}
        </AppShell.Section>

        <AppShell.Section>
          <Text size="xs" c="dimmed" ta="center">
            © 2026 Pollr
          </Text>
        </AppShell.Section>
      </AppShell.Navbar>

      <AppShell.Main>{children}</AppShell.Main>
    </AppShell>
  );
};

export default UserLayout;
