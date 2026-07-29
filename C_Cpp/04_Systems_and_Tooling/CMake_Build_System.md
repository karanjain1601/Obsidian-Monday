---
title: CMake Build System
aliases: [CMakeLists.txt, CMake, C++ Build System, CTest, CPack]
tags: [C, Cpp, CMake, build-system, tooling]
domain: C_Cpp
difficulty: Intermediate
created: 2026-07-29
related:
  - "[[C_Overview]]"
  - "[[Cpp_Overview]]"
  - "[[C_Cpp_Testing_and_Debug]]"
  - "[[C_Cpp_Interop_and_FFI]]"
status: complete
---

# CMake Build System

> [!abstract] TL;DR
> CMake is the de facto standard build system generator for C and C++ projects. It describes builds in `CMakeLists.txt` files and generates native build files (Makefiles, Ninja, Visual Studio projects). Modern CMake (3.x+) uses a target-centric model: each target (executable or library) declares its own include paths, link dependencies, and compile flags, and transitive requirements propagate automatically.

---

## Minimal Project Structure

```
my_project/
├── CMakeLists.txt
├── src/
│   ├── main.cpp
│   └── utils.cpp
├── include/
│   └── utils.h
├── tests/
│   └── test_utils.cpp
└── build/        ← out-of-source build directory (never commit)
```

---

## CMakeLists.txt — Modern C++ Project

```cmake
cmake_minimum_required(VERSION 3.20)
project(MyProject
    VERSION 1.2.3
    DESCRIPTION "A sample C++ project"
    LANGUAGES CXX C
)

# Force C++20 for all targets
set(CMAKE_CXX_STANDARD 20)
set(CMAKE_CXX_STANDARD_REQUIRED ON)
set(CMAKE_CXX_EXTENSIONS OFF)    # disable GCC extensions like -std=gnu++20

# ── Library target ────────────────────────────────────────────────────────────
add_library(utils STATIC
    src/utils.cpp
)

# target_include_directories: PUBLIC = propagates to consumers
#                             PRIVATE = only for this target
#                             INTERFACE = only for consumers (header-only)
target_include_directories(utils
    PUBLIC  ${CMAKE_CURRENT_SOURCE_DIR}/include
    PRIVATE ${CMAKE_CURRENT_SOURCE_DIR}/src
)

target_compile_options(utils PRIVATE
    $<$<CXX_COMPILER_ID:GNU,Clang>:-Wall -Wextra -Wpedantic>
    $<$<CXX_COMPILER_ID:MSVC>:/W4>
)

# ── Executable target ─────────────────────────────────────────────────────────
add_executable(myapp src/main.cpp)

# target_link_libraries: links myapp against utils, inheriting its PUBLIC includes
target_link_libraries(myapp PRIVATE utils)

# ── Install rules ─────────────────────────────────────────────────────────────
install(TARGETS myapp utils
    RUNTIME DESTINATION bin
    LIBRARY DESTINATION lib
    ARCHIVE DESTINATION lib
)
install(DIRECTORY include/ DESTINATION include)
```

---

## Finding and Using External Libraries

```cmake
# find_package: locate an installed library
# Searches CMAKE_PREFIX_PATH, system paths, and <Package>Config.cmake files
find_package(OpenSSL REQUIRED)          # REQUIRED: error if not found
find_package(Boost 1.75 COMPONENTS regex filesystem)  # optional components

if(OpenSSL_FOUND)
    target_link_libraries(myapp PRIVATE OpenSSL::SSL OpenSSL::Crypto)
endif()

# pkg-config fallback (Linux)
find_package(PkgConfig REQUIRED)
pkg_check_modules(LIBSSH REQUIRED libssh)
target_include_directories(myapp PRIVATE ${LIBSSH_INCLUDE_DIRS})
target_link_libraries(myapp PRIVATE ${LIBSSH_LIBRARIES})

# FetchContent: download and build dependencies at configure time (CMake 3.14+)
include(FetchContent)
FetchContent_Declare(
    googletest
    GIT_REPOSITORY https://github.com/google/googletest.git
    GIT_TAG        v1.14.0
)
FetchContent_MakeAvailable(googletest)
target_link_libraries(myapp PRIVATE GTest::gtest_main)
```

---

## Build Workflow

```bash
# Out-of-source build — NEVER build in the source directory
mkdir build && cd build

# Configure: generate build files
cmake .. -DCMAKE_BUILD_TYPE=Release    # Release: -O2, no debug symbols
# cmake .. -DCMAKE_BUILD_TYPE=Debug    # Debug: -O0 -g
# cmake .. -DCMAKE_BUILD_TYPE=RelWithDebInfo  # -O2 -g (profiling-friendly)

# Build: compile and link (--parallel uses all CPU cores)
cmake --build . --parallel 8

# Install
cmake --install . --prefix /usr/local

# Other useful flags
cmake .. -DCMAKE_CXX_COMPILER=clang++ -DCMAKE_C_COMPILER=clang
cmake .. -G Ninja        # use Ninja instead of Make (faster)
cmake .. -DCMAKE_EXPORT_COMPILE_COMMANDS=ON   # generates compile_commands.json for IDE/clangd
```

---

## CMake Presets (CMake 3.19+)

```json
// CMakePresets.json — commit this to version control
{
  "version": 3,
  "configurePresets": [
    {
      "name": "release",
      "binaryDir": "${sourceDir}/build/release",
      "cacheVariables": {
        "CMAKE_BUILD_TYPE": "Release",
        "CMAKE_CXX_COMPILER": "g++"
      }
    },
    {
      "name": "asan",
      "binaryDir": "${sourceDir}/build/asan",
      "cacheVariables": {
        "CMAKE_BUILD_TYPE": "Debug",
        "CMAKE_CXX_FLAGS": "-fsanitize=address,undefined"
      }
    }
  ],
  "buildPresets": [
    { "name": "release", "configurePreset": "release" }
  ]
}
```

```bash
cmake --preset release
cmake --build --preset release
```

---

## CTest — Testing Integration

```cmake
# CMakeLists.txt — enable testing
include(CTest)    # enables 'cmake --build . --target test'
enable_testing()

# After fetching googletest:
add_executable(unit_tests tests/test_utils.cpp)
target_link_libraries(unit_tests PRIVATE utils GTest::gtest_main)

# Register the test with CTest
add_test(NAME unit_tests COMMAND unit_tests)
add_test(NAME integration COMMAND myapp --test-mode)
set_tests_properties(integration PROPERTIES TIMEOUT 30)
```

```bash
cd build
ctest --output-on-failure      # run all tests
ctest -R unit                  # run tests matching "unit" regex
ctest -j 4                     # run 4 tests in parallel
```

---

## CPack — Packaging

```cmake
# CMakeLists.txt — packaging
set(CPACK_PACKAGE_NAME "MyProject")
set(CPACK_PACKAGE_VERSION ${PROJECT_VERSION})
set(CPACK_GENERATOR "TGZ;DEB")    # .tar.gz and .deb packages
include(CPack)
```

```bash
cd build && cpack    # generates MyProject-1.2.3-Linux.tar.gz
```

---

## Common Pitfalls

- **Building in-source:** CMake generates files that pollute the source tree. Always use a separate `build/` directory. Add `build/` to `.gitignore`.
- **Using `include_directories` instead of `target_include_directories`:** The global `include_directories` command affects ALL targets in the CMakeLists. Use the target-scoped version with `PUBLIC`/`PRIVATE`/`INTERFACE` for proper dependency propagation.
- **`GLOB` for source files:** `file(GLOB SOURCES src/*.cpp)` does not re-run CMake when files are added — new files are silently ignored until cmake is manually re-run. List source files explicitly or use `file(GLOB_RECURSE ... CONFIGURE_DEPENDS ...)`.

---

## Review Questions

1. What is the difference between `PUBLIC`, `PRIVATE`, and `INTERFACE` in `target_include_directories`? When does each propagate to consumers of the library?
2. Why should C++ builds always be out-of-source? What problem does an in-source build cause for version control?
3. `add_library(mylib STATIC ...)` vs `add_library(mylib SHARED ...)` vs `add_library(mylib INTERFACE ...)` — explain when you would choose each type.
4. Describe the CMake configure → build → test → install workflow. What does each step produce?

---

#C #Cpp
