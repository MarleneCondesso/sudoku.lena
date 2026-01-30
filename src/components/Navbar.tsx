import NavbarTheme from "./NavbarTheme";

/**
 * Navbar component renders the theme toggle navbar for non-game scenes.
 * It passes `onGameScene={false}` to indicate it's not in a game context.
 */
function Navbar() {
    return <NavbarTheme onGameScene={false} />;
}

export default Navbar;
