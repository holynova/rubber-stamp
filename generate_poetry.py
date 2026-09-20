#!/usr/bin/env python3
# -*- coding: utf-8 -*-

from pathlib import Path
import json, os, re, shutil, subprocess, time

BASE = Path(__file__).resolve().parent
POETRY_DIR = BASE / "images" / "poetry"
POETRY_DIR.mkdir(parents=True, exist_ok=True)

PROMPTS_POETRY = json.loads((BASE / "prompts_poetry.json").read_text(encoding="utf-8")) if (BASE / "prompts_poetry.json").exists() else []

def wait_for_session_ready(timeout=60):
    start = time.time()
    while time.time() - start < timeout:
        try:
            r = subprocess.run(["opencli", "chatgpt", "status", "-f", "yaml"], capture_output=True, text=True, timeout=10)
            if "SESSION_BUSY" not in (r.stdout + r.stderr):
                return True
        except Exception:
            return True
        time.sleep(5)
    return False

def generate_item(item, out_dir):
    target = BASE / item["output"]
    if target.exists() and target.stat().st_size > 100_000:
        print(f"[{item['name']}] Already exists: {target.name} ({target.stat().st_size} bytes)", flush=True)
        return True

    print(f"[{item['name']}] Starting generation...", flush=True)
    env = os.environ.copy()
    
    cmd = [
        "opencli", "chatgpt", "image", item["prompt"],
        "--window", "background",
        "-f", "yaml", "--op", str(out_dir), "--timeout", "240"
    ]
    
    for attempt in range(1, 6):
        wait_for_session_ready()
        start_ts = time.time()
        try:
            print(f"  [{item['name']}] Running opencli (attempt {attempt})...", flush=True)
            r = subprocess.run(cmd, capture_output=True, text=True, timeout=280, env=env)
            combined = r.stdout + "\n" + r.stderr
            
            if "SESSION_BUSY" in combined:
                print(f"  [{item['name']}] Session busy, waiting 15s...", flush=True)
                time.sleep(15)
                continue
            
            # 1. Parse output file from stdout
            found = re.findall(r"file:\s*📁\s*(\S+\.png)", combined)
            if found:
                saved = Path(os.path.expanduser(found[-1]))
                if saved.exists() and saved.stat().st_size > 100_000:
                    if saved.resolve() != target.resolve():
                        shutil.move(str(saved), str(target))
                    print(f"  [{item['name']}] SUCCESS (parsed): saved to {target.name} ({target.stat().st_size} bytes)", flush=True)
                    return True
            
            # 2. Check out_dir for newly created chatgpt_*.png
            new_files = [p for p in out_dir.glob("chatgpt_*.png") if p.stat().st_mtime >= start_ts - 5 and p.stat().st_size > 100_000]
            if new_files:
                new_files.sort(key=lambda p: p.stat().st_mtime, reverse=True)
                shutil.move(str(new_files[0]), str(target))
                print(f"  [{item['name']}] SUCCESS (fs scan): saved to {target.name} ({target.stat().st_size} bytes)", flush=True)
                return True
                
            print(f"  [{item['name']}] Attempt {attempt} output:\n{combined[-300:]}", flush=True)
        except subprocess.TimeoutExpired:
            print(f"  [{item['name']}] Attempt {attempt} timeout (280s).", flush=True)
        except Exception as e:
            print(f"  [{item['name']}] Attempt {attempt} exception: {e}", flush=True)
        time.sleep(8)
    
    print(f"[{item['name']}] FAILED after all attempts.", flush=True)
    return False

def run_all():
    manifest_path = BASE / "generation_manifest_series.json"
    manifest = {}
    if manifest_path.exists():
        try:
            manifest = json.loads(manifest_path.read_text(encoding="utf-8"))
        except Exception:
            manifest = {}

    print(f"=== Generating Poetry Series ({len(PROMPTS_POETRY)} items) ===", flush=True)
    while True:
        missing = [item for item in PROMPTS_POETRY if not (BASE / item["output"]).exists() or (BASE / item["output"]).stat().st_size <= 100_000]
        if not missing:
            print("\n All 50 Poetry prints generated successfully!", flush=True)
            break
        
        print(f"\n--- Remaining Poetry prints to generate: {len(missing)} items ---", flush=True)
        for idx, item in enumerate(missing, 1):
            print(f"\n--- Poetry Print ({idx}/{len(missing)}): {item['name']} ({item['author']}) ---", flush=True)
            ok = generate_item(item, POETRY_DIR)
            manifest[item["output"]] = {
                "name": item["name"],
                "series": "poetry",
                "output": item["output"],
                "status": "success" if ok else "failed",
                "time": time.strftime("%Y-%m-%d %H:%M:%S")
            }
            manifest_path.write_text(json.dumps(manifest, ensure_ascii=False, indent=2), encoding="utf-8")
            time.sleep(5)

    print("\n=== Poetry Generation Finished ===", flush=True)

if __name__ == "__main__":
    run_all()
