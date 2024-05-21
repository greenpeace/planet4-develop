{
  description = "frontend";

  inputs = {
    nixpkgs.url = "github:NixOS/nixpkgs/7592790b9e02f7f99ddcb1bd33fd44ff8df6a9a7";

    flake-utils.url = "github:numtide/flake-utils";

  };

  outputs = { self, nixpkgs, flake-utils}:
    flake-utils.lib.eachDefaultSystem (system:
      let
        pkgs = import nixpkgs {
          inherit system;
        };
      in
      {

        devShells.default = pkgs.mkShell {
          buildInputs = with pkgs; [
            nodejs
          ];

        };

      });
}
