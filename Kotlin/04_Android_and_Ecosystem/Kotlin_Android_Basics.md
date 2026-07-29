---
title: Kotlin Android Basics
aliases: [Kotlin Android, viewModelScope, lifecycleScope, Android KTX, Hilt Kotlin]
tags: [Kotlin, Android, ViewModel, Hilt, StateFlow, KTX]
domain: Kotlin
difficulty: Intermediate
created: 2026-07-29
related: []
status: complete
---

# 🟣 Kotlin Android Basics

> [!abstract] TL;DR
> Kotlin is Google's preferred Android language. Key patterns: `viewModelScope`/`lifecycleScope` tie coroutines to Android lifecycle components; `StateFlow` replaces `LiveData` for reactive UI state; Android KTX provides idiomatic Kotlin extensions for framework APIs; View Binding eliminates `findViewById` with null safety; Hilt provides compile-time dependency injection with `@HiltViewModel` and `@Inject`. Compose is the modern declarative UI toolkit built entirely for Kotlin.

---

## Intuition

Android development before Kotlin required verbose Java ceremony: anonymous inner classes for listeners, null-checking everywhere, thread management via `AsyncTask` (deprecated), and manual `findViewById` with casts. Kotlin + Jetpack transforms this: extension functions simplify framework APIs, coroutines replace callbacks, `StateFlow` models reactive state safely, and Hilt wires dependencies at compile time rather than runtime.

---

## How It Works

### Activity / Fragment Lifecycle with Coroutines

```kotlin
// ── Activity ──────────────────────────────────────────────────────────────────
class MainActivity : AppCompatActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_main)

        // lifecycleScope — tied to Activity lifecycle (cancelled in onDestroy)
        lifecycleScope.launch {
            val data = withContext(Dispatchers.IO) { fetchSomeData() }
            updateUI(data)
        }

        // launchWhenStarted — only runs when at least STARTED (deprecated in favor of repeatOnLifecycle)
        // repeatOnLifecycle — correct pattern for collecting flows
        lifecycleScope.launch {
            repeatOnLifecycle(Lifecycle.State.STARTED) {
                viewModel.uiState.collect { state ->
                    render(state)    // only called when Activity is visible
                }
            }
        }
    }
}
```

### ViewModel with `viewModelScope` and `StateFlow`

```kotlin
data class UiState(
    val isLoading: Boolean = false,
    val users: List<User> = emptyList(),
    val error: String? = null
)

@HiltViewModel
class UserListViewModel @Inject constructor(
    private val userRepository: UserRepository
) : ViewModel() {

    private val _uiState = MutableStateFlow(UiState(isLoading = true))
    val uiState: StateFlow<UiState> = _uiState.asStateFlow()

    init { loadUsers() }

    fun loadUsers() {
        viewModelScope.launch {             // SupervisorJob + Main dispatcher
            _uiState.update { it.copy(isLoading = true, error = null) }
            try {
                val users = withContext(Dispatchers.IO) { userRepository.getAll() }
                _uiState.update { it.copy(isLoading = false, users = users) }
            } catch (e: IOException) {
                _uiState.update { it.copy(isLoading = false, error = e.message) }
            }
        }
    }

    fun refresh() { loadUsers() }
}
// StateFlow vs LiveData:
// StateFlow: no Android dependency, works in unit tests without instrumentation, Kotlin-native
// LiveData: lifecycle-aware out of the box, familiar to Android veterans, no initial value required
```

### Android KTX — Idiomatic Extensions

```kotlin
// android.core-ktx, lifecycle-ktx, fragment-ktx add Kotlin extension functions

// View extensions
view.isVisible = true                           // instead of view.visibility = View.VISIBLE
button.setOnClickListener { handleClick() }     // SAM lambda (Java interface)

// String resources, colors
val text  = context.getString(R.string.app_name)
val color = ContextCompat.getColor(context, R.color.primary)

// SharedPreferences
val prefs = getSharedPreferences("app", Context.MODE_PRIVATE)
prefs.edit {                                    // KTX: edit { } commits automatically
    putString("user_id", "123")
    putBoolean("logged_in", true)
}

// Fragment result API
setFragmentResult("requestKey", bundleOf("result" to "value"))  // bundleOf = KTX

// Navigation
findNavController().navigate(
    HomeFragmentDirections.actionHomeToDetail(userId = 42)   // type-safe NavArgs
)

// Coroutines in lifecycle
// fragment-ktx: viewModels() delegate
val viewModel: UserListViewModel by viewModels()
```

### View Binding vs Data Binding

```kotlin
// ─── View Binding (recommended) — null-safe, no annotation processing overhead
class UserFragment : Fragment(R.layout.fragment_user) {
    private var _binding: FragmentUserBinding? = null
    private val binding get() = _binding!!

    override fun onViewCreated(view: View, savedInstanceState: Bundle?) {
        _binding = FragmentUserBinding.bind(view)
        binding.usernameText.text = "Alice"     // null-safe, typed access
        binding.submitButton.setOnClickListener { submitForm() }
    }

    override fun onDestroyView() {
        super.onDestroyView()
        _binding = null          // avoid memory leak — Fragment view destroyed before Fragment
    }
}

// ─── Data Binding — two-way binding with XML expressions (more complex)
// <TextView android:text="@{viewModel.userName}" />
// Requires: buildFeatures { dataBinding = true }
```

### Hilt Dependency Injection

```kotlin
// ─── Application ──────────────────────────────────────────────────────────────
@HiltAndroidApp
class MyApplication : Application()

// ─── Module — provides dependencies ───────────────────────────────────────────
@Module
@InstallIn(SingletonComponent::class)
object DatabaseModule {
    @Provides @Singleton
    fun provideDatabase(@ApplicationContext ctx: Context): AppDatabase =
        Room.databaseBuilder(ctx, AppDatabase::class.java, "app.db").build()

    @Provides @Singleton
    fun provideUserDao(db: AppDatabase): UserDao = db.userDao()
}

// ─── Repository ───────────────────────────────────────────────────────────────
class UserRepository @Inject constructor(
    private val userDao: UserDao,
    private val apiService: ApiService
) {
    suspend fun getAll(): List<User> = userDao.getAll()
}

// ─── ViewModel ────────────────────────────────────────────────────────────────
@HiltViewModel
class UserListViewModel @Inject constructor(
    private val repository: UserRepository   // injected by Hilt
) : ViewModel() { /* ... */ }

// ─── Fragment ─────────────────────────────────────────────────────────────────
@AndroidEntryPoint
class UserFragment : Fragment() {
    private val viewModel: UserListViewModel by viewModels()  // Hilt-aware
}
```

## Android Jetpack + Kotlin Quick Reference

| Component | Kotlin Feature | Purpose |
|-----------|---------------|---------|
| `ViewModel` | `viewModelScope` | Lifecycle-bound coroutines |
| `LiveData` / `StateFlow` | `StateFlow`, `asLiveData()` | Reactive UI state |
| Room | `suspend` DAO functions | Async DB access |
| Navigation | `navArgs()`, type-safe directions | Fragment/Activity navigation |
| Hilt | `@Inject`, `@HiltViewModel` | Compile-time DI |
| WorkManager | `CoroutineWorker` | Background work |

## Common Pitfalls

| # | Pitfall | Fix |
|---|---------|-----|
| 1 | Collecting Flow in `lifecycleScope.launch` without `repeatOnLifecycle` — collects in background | Wrap with `repeatOnLifecycle(STARTED)` to stop when UI is hidden |
| 2 | Holding `binding` reference in `Fragment` after `onDestroyView` — memory leak | Set `_binding = null` in `onDestroyView()` |
| 3 | Doing network/DB work on Main thread — ANR | Always wrap with `withContext(Dispatchers.IO)` or use Room's async DAO |
| 4 | Using `MutableStateFlow.value =` concurrently — race condition | Use `MutableStateFlow.update { }` for atomic read-modify-write |
| 5 | Forgetting `@HiltAndroidApp` on Application class | Hilt won't initialise; crashes at injection points |

## Review Questions

1. Why should you use `repeatOnLifecycle(STARTED)` rather than `lifecycleScope.launch` directly when collecting a `StateFlow`?
2. What is the difference between `StateFlow` and `LiveData`? When would you choose each?
3. How does Hilt's `@HiltViewModel` differ from manually constructing a ViewModel? What problem does it solve?

---

Related: [[Structured_Concurrency]] | [[Kotlin_Flow]] | [[Coroutine_Builders_and_Scope]] | [[Kotlin_Testing]]

#Kotlin
