import os
import datetime
import subprocess

BASE_DIR = os.getcwd()

PROGRAMS = [
    ("dsa/arrays", "reverse_array.py", "Reverse an array"),
    ("dsa/strings", "palindrome.py", "Check palindrome"),
    ("dsa/maths", "factorial.py", "Factorial of a number"),
    ("python/basics", "hello.py", "Hello World"),
    ("python/loops", "sum_n.py", "Sum of N numbers"),
]

today = datetime.date.today().strftime("%Y-%m-%d")

for folder, filename, title in PROGRAMS:
    path = os.path.join(BASE_DIR, folder)
    os.makedirs(path, exist_ok=True)

    file_path = os.path.join(path, f"{today}_{filename}")

    if not os.path.exists(file_path):
        with open(file_path, "w") as f:
            f.write(f"""# {title}
# Date: {today}

def solve():
    pass

if __name__ == "__main__":
    solve()
""")

print("✔ 5 program files created")

subprocess.run(["git", "add", "."])
subprocess.run(["git", "commit", "-m", f"Daily 5 programs - {today}"])
subprocess.run(["git", "push", "origin", "main"])

print("✔ Code pushed to GitHub")
