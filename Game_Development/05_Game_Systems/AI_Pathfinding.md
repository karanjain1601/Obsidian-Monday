---
title: Game AI and Pathfinding
aliases: []
tags: [GameDev, AI, Pathfinding, Algorithms]
domain: Game Development
difficulty: Intermediate
created: 2026-07-29
related: []
status: complete
---

# Game AI and Pathfinding

> [!abstract] TL;DR
> A* is the gold standard for grid pathfinding; navmesh is preferred for 3D games. Steering behaviors create natural-feeling movement. Behavior Trees power AAA NPC logic. Understanding these systems lets you build enemies that feel intelligent without brute-force computation.

## A* Algorithm

A* (pronounced "A-star") is the dominant pathfinding algorithm in game development. It finds the shortest path between two nodes on a weighted graph by combining the actual cost from the start (g) with a heuristic estimate of remaining distance to the goal (h).

**Core data:**
- `g(n)`: cost to reach node `n` from the start (exact, accumulated along the path).
- `h(n)`: estimated cost from `n` to the goal (heuristic — must be admissible: never overestimate).
- `f(n) = g(n) + h(n)`: priority score — A* always expands the lowest-f node next.

**Open set**: nodes discovered but not yet fully evaluated (typically a min-heap keyed by f).
**Closed set**: nodes already evaluated — skip if encountered again (unless a shorter path is found).

```
ALGORITHM A*(start, goal):
    open = priority_queue with {f: h(start, goal), node: start}
    g[start] = 0
    parent = {}

    while open is not empty:
        current = open.pop_min()                 # lowest f score

        if current == goal:
            return reconstruct_path(parent, goal)

        closed.add(current)

        for neighbor in neighbors(current):
            if neighbor in closed: continue

            tentative_g = g[current] + cost(current, neighbor)

            if tentative_g < g.get(neighbor, INFINITY):
                parent[neighbor] = current
                g[neighbor] = tentative_g
                f = tentative_g + h(neighbor, goal)
                open.push({f: f, node: neighbor})

    return []  # no path found

RECONSTRUCT_PATH(parent, goal):
    path = [goal]
    while goal in parent:
        goal = parent[goal]
        path.prepend(goal)
    return path
```

**Heuristics by grid type:**
- **Manhattan distance** (4-directional grid): `|dx| + |dy|` — exact on grids where diagonal movement is forbidden.
- **Euclidean distance** (any direction): `sqrt(dx² + dy²)` — admissible for any movement.
- **Chebyshev / Octile distance** (8-directional grid): `max(|dx|, |dy|)` or `max(|dx|, |dy|) + (sqrt(2)-1) * min(|dx|, |dy|)` — admissible for 8-way movement.
- An **inadmissible heuristic** (overestimates) produces faster but suboptimal paths — sometimes acceptable (Weighted A*).

**Performance notes:**
- A* on a 100×100 grid is fine. On a 1000×1000 grid, use Hierarchical Pathfinding (HPA*): cluster the grid, pathfind at cluster level, then within clusters.
- Precompute paths for static maps; recompute only when the world changes.
- Path caching: cache paths for a few frames; small position changes rarely invalidate the path.

## Navmesh Pathfinding

A **navigation mesh (navmesh)** is a set of precomputed convex polygons (usually triangles) that cover all walkable surfaces in a level. Instead of a grid with thousands of nodes, a navmesh might have only hundreds of polygons — dramatically fewer nodes to search.

Advantages over grid A*:
- **Scale**: a large open world needs a coarse navmesh, not a massive grid.
- **Diagonal movement**: no axis-aligned cell bias; paths are geometrically optimal.
- **3D support**: navmeshes naturally handle slopes, stairs, multi-floor buildings.
- **Funnel algorithm**: after finding the sequence of polygons, the Sustainable Channel algorithm (funnel/string-pulling) straightens the path through polygon portal edges into smooth waypoints.

Navmeshes are used in:
- **Unreal Engine 5**: built-in NavMesh (`NavMeshBoundsVolume`, `UNavigationSystemV1`, `AIController::MoveToActor()`).
- **Unity**: built-in NavMesh baking, `NavMeshAgent` component (automatic pathfinding + obstacle avoidance).
- **Godot 4**: `NavigationServer2D`/`NavigationServer3D` + `NavigationAgent2D`/`NavigationAgent3D` components.
- **Recast/Detour**: the open-source C++ library underlying many engines' navmesh systems.

```gdscript
# Godot 4 NavigationAgent2D example
extends CharacterBody2D

@onready var nav_agent: NavigationAgent2D = $NavigationAgent2D
var target_position: Vector2 = Vector2.ZERO
var speed: float = 100.0

func _ready() -> void:
    nav_agent.velocity_computed.connect(_on_velocity_computed)
    nav_agent.navigation_finished.connect(_on_navigation_finished)

func set_target(pos: Vector2) -> void:
    target_position = pos
    nav_agent.target_position = pos

func _physics_process(_delta: float) -> void:
    if nav_agent.is_navigation_finished():
        return
    var next_pos: Vector2 = nav_agent.get_next_path_position()
    var direction: Vector2 = (next_pos - global_position).normalized()
    nav_agent.set_velocity(direction * speed)   # triggers avoidance calculation

func _on_velocity_computed(safe_velocity: Vector2) -> void:
    velocity = safe_velocity
    move_and_slide()

func _on_navigation_finished() -> void:
    velocity = Vector2.ZERO
```

## Steering Behaviors

Steering behaviors generate **local movement forces** without requiring global pathfinding. They are composable: combine multiple behaviors to produce complex emergent motion.

| Behavior | Description |
|----------|-------------|
| **Seek** | Accelerate toward target position |
| **Flee** | Accelerate away from threat |
| **Arrive** | Seek with deceleration zone near target |
| **Pursue** | Seek predicted future position of moving target |
| **Evade** | Flee from predicted future position |
| **Wander** | Smoothly vary heading with constrained random perturbation |
| **Separation** | Repulsion force away from nearby agents |
| **Cohesion** | Attraction toward average position of neighbors |
| **Alignment** | Match heading to average heading of neighbors |
| **Obstacle Avoidance** | Detect obstacles ahead, steer around them |
| **Path Following** | Follow a predefined path with seek behavior |

```gdscript
# Steering behavior library (Godot 4 GDScript)
class_name SteeringBehaviors

static func seek(agent_pos: Vector2, agent_vel: Vector2,
                 target_pos: Vector2, max_speed: float, max_force: float) -> Vector2:
    var desired: Vector2 = (target_pos - agent_pos).normalized() * max_speed
    return (desired - agent_vel).limit_length(max_force)

static func arrive(agent_pos: Vector2, agent_vel: Vector2,
                   target_pos: Vector2, slow_radius: float,
                   max_speed: float, max_force: float) -> Vector2:
    var to_target: Vector2 = target_pos - agent_pos
    var dist: float = to_target.length()
    var desired_speed: float = max_speed if dist > slow_radius else max_speed * (dist / slow_radius)
    var desired: Vector2 = to_target.normalized() * desired_speed
    return (desired - agent_vel).limit_length(max_force)

static func separation(agent_pos: Vector2, neighbors: Array, 
                        min_dist: float, max_force: float) -> Vector2:
    var force: Vector2 = Vector2.ZERO
    for neighbor in neighbors:
        var offset: Vector2 = agent_pos - neighbor.global_position
        var dist: float = offset.length()
        if dist < min_dist and dist > 0.001:
            force += offset.normalized() * (min_dist - dist) / min_dist
    return force.limit_length(max_force)

# Combine behaviors with weights
func calculate_steering(delta: float) -> Vector2:
    var seek_force = SteeringBehaviors.seek(
        global_position, velocity, target.global_position, max_speed, max_force
    ) * 1.0
    var sep_force = SteeringBehaviors.separation(
        global_position, nearby_enemies, 40.0, max_force
    ) * 1.5
    return (seek_force + sep_force).limit_length(max_force)
```

## Boids Flocking

Craig Reynolds' **Boids** algorithm (1987) simulates flocking behavior using only three local steering rules per agent. No central coordination — emergent group behavior arises from individual interactions:

1. **Separation**: steer to avoid crowding local flockmates (personal space).
2. **Alignment**: steer toward the average heading of local flockmates (flock direction).
3. **Cohesion**: steer toward the average position of local flockmates (stay together).

Each boid only considers neighbors within its perception radius. The result convincingly simulates bird flocks, fish schools, and enemy swarms. Tuning the three weights changes the character: high separation = spread-out cloud, high cohesion = tight ball, high alignment = synchronized convoy.

## Finite State Machine for AI

For most game enemies, a simple FSM with 3–6 states is sufficient and highly readable:

```gdscript
extends CharacterBody2D

enum AIState { PATROL, CHASE, ATTACK, FLEE, INVESTIGATE }
var ai_state: AIState = AIState.PATROL
var patrol_index: int = 0
var last_known_player_pos: Vector2

@export var patrol_points: Array[Marker2D] = []
@export var detection_range: float = 200.0
@export var attack_range: float = 40.0
@export var flee_health_threshold: float = 20.0
@export var move_speed: float = 80.0

@onready var nav_agent: NavigationAgent2D = $NavigationAgent2D
@onready var player: CharacterBody2D = $"../Player"  # set properly in project

func _physics_process(delta: float) -> void:
    match ai_state:
        AIState.PATROL:      _state_patrol()
        AIState.CHASE:       _state_chase()
        AIState.ATTACK:      _state_attack()
        AIState.FLEE:        _state_flee()
        AIState.INVESTIGATE: _state_investigate()

func _state_patrol() -> void:
    if patrol_points.is_empty(): return
    nav_agent.target_position = patrol_points[patrol_index].global_position
    if nav_agent.is_navigation_finished():
        patrol_index = (patrol_index + 1) % patrol_points.size()
    if can_see_player():
        transition_to(AIState.CHASE)

func _state_chase() -> void:
    last_known_player_pos = player.global_position
    nav_agent.target_position = player.global_position
    if distance_to_player() <= attack_range:
        transition_to(AIState.ATTACK)
    elif not can_see_player():
        transition_to(AIState.INVESTIGATE)  # go to last known position
    if health < flee_health_threshold:
        transition_to(AIState.FLEE)

func _state_attack() -> void:
    if distance_to_player() > attack_range * 1.5:
        transition_to(AIState.CHASE)
    # Actual attack logic: cooldown timer, animation, damage dealt

func _state_flee() -> void:
    var flee_direction: Vector2 = (global_position - player.global_position).normalized()
    nav_agent.target_position = global_position + flee_direction * 200.0
    if not can_see_player() and distance_to_player() > 300.0:
        transition_to(AIState.PATROL)

func can_see_player() -> bool:
    if distance_to_player() > detection_range: return false
    # Optionally: raycast to check line-of-sight
    var space = get_world_2d().direct_space_state
    var query = PhysicsRayQueryParameters2D.create(
        global_position, player.global_position, 0b001  # world layer only
    )
    var result = space.intersect_ray(query)
    return result.is_empty()   # no obstacle between enemy and player

func distance_to_player() -> float:
    return global_position.distance_to(player.global_position)

func transition_to(new_state: AIState) -> void:
    ai_state = new_state
```

## Behavior Trees

Behavior Trees (BTs) scale better than FSMs for complex AI with many states and transitions. The tree is evaluated top-to-bottom each frame.

**Composite nodes** (control flow):
- **Sequence** (→): executes children left-to-right. Succeeds only if ALL children succeed. Fails on first failure. Like a logical AND.
- **Selector** (?) : executes children left-to-right. Succeeds on the FIRST successful child. Like a logical OR / fallback.
- **Parallel**: runs multiple children simultaneously.

**Decorator nodes**: wrap one child and modify its behavior — `Inverter` (NOT), `Repeat(N)`, `Cooldown(t)`, `Timeout(t)`.

**Task/Leaf nodes**: actual behaviors — `MoveTo`, `PlayAnimation`, `Attack`, `Patrol`, `Wait`.

```
Root
└── Selector
    ├── Sequence (is_health_critical)        -- flee behavior
    │   ├── CheckHealth(< 20)
    │   └── FleeFromPlayer
    ├── Sequence (can_attack)                -- attack behavior
    │   ├── IsPlayerInRange(40)
    │   └── Cooldown(0.8) → AttackPlayer
    ├── Sequence (can_see_player)            -- chase behavior
    │   ├── CanSeePlayer
    │   └── ChasePlayer
    └── Patrol                               -- default fallback
```

Benefits over FSM: modular subtrees can be reused across different enemy types, interruption is handled by tree re-evaluation priority rather than explicit transition rules, and visual debuggers show exactly which branch fired each frame.

Used in: Unreal Engine's built-in Behavior Tree editor, Unity's GOAP / custom BT packages (Behavior Designer, NodeCanvas), and open-source implementations (fluid-behavior-tree, NPBehave).

## GOAP and Utility AI

**GOAP (Goal-Oriented Action Planning)**: AI has goals (states it wants to achieve) and actions with preconditions and effects. A planner finds the cheapest action sequence to satisfy the goal at runtime. Famous use: F.E.A.R.'s Alma Enemies and Valve's Left 4 Dead Director. Enemies feel smarter because they adapt plans dynamically rather than following scripted state transitions.

**Utility AI**: each possible action has a utility score computed by a curve or formula (health × 0.3 + range_factor × 0.7). The AI executes the highest-scoring action each frame. Used in The Sims (full Utility AI system). Produces gradual, realistic behavioral transitions — no hard thresholds like FSMs.

## A* Algorithm Flow

```mermaid
flowchart TD
    Start(["Start A*"]) --> Init["Initialize:\nopen = {start}\ng[start] = 0\nf[start] = h(start, goal)"]
    Init --> Empty{Open set empty?}
    Empty -->|Yes| NoPath(["Return: No Path"])
    Empty -->|No| PopMin["Pop node with lowest f\n= current"]
    PopMin --> IsGoal{current == goal?}
    IsGoal -->|Yes| Reconstruct["Reconstruct path\nvia parent pointers"]
    Reconstruct --> Done(["Return Path"])
    IsGoal -->|No| Expand["Add current to closed set\nExpand neighbors"]
    Expand --> ForNeighbor["For each neighbor:"]
    ForNeighbor --> InClosed{In closed set?}
    InClosed -->|Yes| NextNeighbor["Skip"]
    InClosed -->|No| CalcG["tentative_g =\ng[current] + cost(edge)"]
    CalcG --> BetterPath{tentative_g < g[neighbor]?}
    BetterPath -->|No| NextNeighbor
    BetterPath -->|Yes| UpdateNode["Update parent, g, f\nAdd to open set"]
    UpdateNode --> NextNeighbor
    NextNeighbor --> ForNeighbor
    ForNeighbor -->|done| Empty

    style Start fill:#2d6a4f,color:#fff
    style Done fill:#2d6a4f,color:#fff
    style NoPath fill:#9b2335,color:#fff
```

## Common Pitfalls

- **Using A* on very large grids without hierarchical pathfinding**: A* on a 2000×2000 grid can take tens of milliseconds per call. Use Hierarchical Pathfinding A* (HPA*) or navmeshes for large worlds. Alternatively, run pathfinding on a background thread with `Thread` or `WorkerThreadPool`.
- **Not updating navmesh when dynamic obstacles change**: if a door closes or debris blocks a path, the navmesh must be rebaked (or updated via NavMeshObstacle). Stale navmeshes cause enemies to walk into walls.
- **Combining too many steering forces without normalization**: summing 5 steering forces without normalizing the result produces forces exceeding `max_force`, causing agents to vibrate or spin. Use `limit_length(max_force)` on the combined vector.
- **Infinite loops in Behavior Trees without cooldown decorators**: a Sequence containing a fast-failing child can loop every frame, executing hundreds of times per second. Wrap attack/ability tasks in a `Cooldown` decorator to enforce minimum intervals.
- **FSM transition symmetry assumption**: just because you can go IDLE → ATTACKING does not mean you handle JUMPING → ATTACKING. Draw all state transitions explicitly before coding.

## Review Questions

1. Why is an admissible heuristic important in A*? What happens to the optimality of the returned path if the heuristic overestimates the remaining cost?
2. What are the advantages of navmesh pathfinding over grid-based A*? In what scenario would you still prefer a grid?
3. What is the key difference between a Behavior Tree Selector node and a Sequence node? Write a three-node example that makes an enemy attack if in range, or patrol otherwise.

## Related Concepts

- [[_MOC_Game_Development_Master|↑ Game Development MOC]]

#GameDev
